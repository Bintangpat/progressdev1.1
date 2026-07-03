import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Patch,
  Delete,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('role') role?: Role) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    // Business Logic: Developer must have team and workspaces
    if (createUserDto.role === 'developer') {
      if (!createUserDto.team) {
        throw new BadRequestException(
          'Developer wajib dimasukkan ke dalam team/department',
        );
      }
      if (!createUserDto.workspaces || createUserDto.workspaces.length === 0) {
        throw new BadRequestException(
          'Developer wajib memilih minimal satu workspace',
        );
      }
    }

    // Ignore workspaces and team for Admin and Stakeholder
    const workspaces =
      createUserDto.role === 'developer' ? createUserDto.workspaces : undefined;
    const team =
      createUserDto.role === 'developer' ? createUserDto.team : undefined;

    let tempPassword = '';
    let hashedPassword: string | null = null;

    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    } else {
      // Generate secure random temporary password
      tempPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).toUpperCase().slice(-4);
      hashedPassword = await bcrypt.hash(tempPassword, 10);
    }

    const user = await this.usersService.create(
      {
        email: createUserDto.email,
        password: hashedPassword,
        displayName: createUserDto.displayName,
        role: createUserDto.role,
      },
      workspaces,
      team,
    );

    // If invitation email is selected (no password sent from client)
    if (tempPassword) {
      try {
        await this.sendInvitationEmail(
          user.email,
          user.displayName || user.email,
          tempPassword,
        );
      } catch (err: any) {
        console.error('Failed to send invitation email via Resend:', err);
        throw new InternalServerErrorException(
          `User berhasil dibuat tetapi email undangan gagal dikirim: ${err.message || err}`,
        );
      }
    }

    const { password, ...result } = user;
    return result;
  }

  @Patch(':id')
  async patchUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Connect workspaces and project team members if updated and developer
    // Note: To keep it simple, we support updating displayName, email, role, and password.
    // If updating role or details, we strip out workspaces/team from basic profile update
    delete updateData.workspaces;
    delete updateData.team;

    const user = await this.usersService.update(id, updateData);
    const { password, ...result } = user;
    return result;
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.usersService.delete(id);
    const { password, ...result } = user;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    const userId = req.user.id;
    return this.usersService.findByIdWithoutPassword(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Req() req: any, @Body() updateDto: any) {
    const userId = req.user.id;
    const allowedFields = {
      displayName: updateDto.displayName,
      email: updateDto.email,
      whatsapp: updateDto.whatsapp,
    };

    if (allowedFields.email && allowedFields.email !== req.user.email) {
      const existing = await this.usersService.findByEmail(allowedFields.email);
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    const updated = await this.usersService.update(userId, allowedFields);
    const { password, ...result } = updated;
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async changePassword(@Req() req: any, @Body() passwordDto: any) {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword } = passwordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findById(userId);
    if (!user || !user.password) {
      throw new UnauthorizedException('User not found or password not set');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Incorrect current password');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.update(userId, { password: newHashedPassword });
    return { message: 'Password updated successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deactivateAccount(@Req() req: any) {
    const userId = req.user.id;
    await this.usersService.delete(userId);
    return { message: 'Account successfully deactivated' };
  }

  private async sendInvitationEmail(
    email: string,
    name: string,
    tempPass: string,
  ) {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || 'no-reply@authentication.web.id';

    if (!apiKey) {
      throw new Error('RESEND_API_KEY tidak dikonfigurasi di environment');
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: email,
        subject: 'Undangan Bergabung ke DevProgress',
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #0b1c30; max-width: 600px; margin: 0 auto; border: 1px solid #e5eeff; border-radius: 8px;">
            <h2 style="color: #0058be;">Halo, ${name}!</h2>
            <p>Anda telah diundang untuk bergabung sebagai anggota tim di platform <strong>DevProgress</strong>.</p>
            <p>Berikut adalah kredensial akun sementara Anda untuk masuk ke sistem:</p>
            <div style="background-color: #f8f9ff; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px dashed #c5c6cd;">
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Password Sementara:</strong> <code style="font-size: 16px; color: #0058be; font-weight: bold;">${tempPass}</code></p>
            </div>
            <p>Silakan klik tombol di bawah ini untuk masuk ke aplikasi, dan Anda akan diminta untuk segera mengubah password pada saat login pertama kali.</p>
            <div style="margin: 25px 0;">
              <a href="http://localhost:3000/login" style="background-color: #0058be; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Masuk ke Aplikasi</a>
            </div>
            <p style="font-size: 12px; color: #75777d; margin-top: 30px;">© ${new Date().getFullYear()} DevProgress Systems. Hak Cipta Dilindungi.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
  }
}

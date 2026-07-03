import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X, Search, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface Participant {
  id: string;
  displayName: string;
  email: string;
}

interface ParticipantSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  availableParticipants: Participant[];
  selectedParticipants: Participant[];
  onSelect: (participant: Participant) => void;
  onRemove: (id: string) => void;
}

export function ParticipantSheet({
  isOpen,
  onOpenChange,
  availableParticipants,
  selectedParticipants,
  onSelect,
  onRemove,
}: ParticipantSheetProps) {
  const [search, setSearch] = useState("");

  const filteredAvailable = availableParticipants.filter((p) => {
    const term = search.toLowerCase();
    return (
      p.displayName.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col h-full bg-white md:max-w-md">
        <SheetHeader className="mb-4">
          <SheetTitle>Manage Participants</SheetTitle>
          <SheetDescription>
            Add or remove developers/presenters for this briefing.
          </SheetDescription>
        </SheetHeader>

        {/* Top: Box showing already added people */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-[#75777d]">
              Selected Participants ({selectedParticipants.length})
            </Label>
            <div className="min-h-[120px] p-4 rounded-xl border border-[#c5c6cd] bg-[#f8f9ff] flex flex-wrap gap-2 content-start">
              {selectedParticipants.length > 0 ? (
                selectedParticipants.map((p) => (
                  <Badge
                    key={p.id}
                    variant="secondary"
                    className="pl-1 pr-2 py-1 h-8 rounded-full bg-[#d8e2ff] text-[#001a42] flex items-center gap-1.5 border-none shadow-xs"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[10px] font-bold bg-[#0058be] text-white">
                        {p.displayName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold">
                      {p.displayName}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(p.id)}
                      className="hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))
              ) : (
                <div className="w-full h-20 flex items-center justify-center text-xs text-[#75777d] italic">
                  No participants added yet.
                </div>
              )}
            </div>
          </div>

          {/* Bottom: Input + Available List */}
          <div className="space-y-4 flex flex-col">
            <div className="space-y-2">
              <Label
                htmlFor="search-participant"
                className="text-xs font-bold uppercase tracking-wider text-[#75777d]"
              >
                Invite Presenter / Developer
              </Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#75777d]" />
                <Input
                  id="search-participant"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 w-full bg-[#f8f9ff] border-[#c5c6cd]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-[#75777d]">
                Available Team Members
              </Label>
              <div className="border border-[#c5c6cd] rounded-xl divide-y divide-[#c5c6cd] overflow-hidden bg-white max-h-[300px] overflow-y-auto">
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((p) => {
                    const isSelected = selectedParticipants.some(
                      (s) => s.id === p.id,
                    );
                    return (
                      <div
                        key={p.id}
                        onClick={() => {
                          if (isSelected) {
                            onRemove(p.id);
                          } else {
                            onSelect(p);
                          }
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer hover:bg-[#eff4ff] transition-all ${
                          isSelected ? "bg-[#eff4ff]/60" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs font-bold bg-primary text-foreground">
                              {p.displayName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-semibold text-foreground">
                              {p.displayName}
                            </div>
                            <div className="text-xs text-foreground">
                              {p.email}
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-foreground">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-xs text-foreground italic">
                    No developers found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-primary w-full py-2.5 font-bold text-sm"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

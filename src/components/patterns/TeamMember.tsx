import { cn } from "@/lib/cn";
import type { TeamMemberInfo } from "@/types/content";
import Image from "next/image";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function TeamMember({ member, className }: { member: TeamMemberInfo; className?: string }) {
  return (
    <div className={cn("w-[100px]", className)}>
      <div
        className={cn(
          "relative size-20 overflow-hidden rounded-2xl lg:size-[100px] lg:rounded-[20px]",
          member.photo ? "bg-avatar-empty" : "flex items-center justify-center bg-placeholder",
        )}
      >
        {member.photo ? (
          <Image src={member.photo.src} alt={member.photo.alt} fill sizes="100px" className="object-cover" />
        ) : (
          // Monogram placeholder until a real photo is added in src/content/contact.ts.
          <span aria-hidden="true" className="text-xl font-semibold tracking-[-0.04em] text-navy lg:text-[30px]">
            {initials(member.name)}
          </span>
        )}
      </div>
      <p className="mt-4 whitespace-nowrap text-base font-medium leading-6 tracking-[-0.05em] text-black lg:mt-[15px] lg:text-[17px]">{member.name}</p>
      <p className="mt-1 whitespace-nowrap text-[13px] leading-4 tracking-[-0.06em] text-role lg:mt-1.5">{member.role}</p>
    </div>
  );
}

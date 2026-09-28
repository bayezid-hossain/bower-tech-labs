import Image from "next/image";
import { cn } from "@/lib/cn";
import type { TeamMemberInfo } from "@/types/content";

export function TeamMember({ member, className }: { member: TeamMemberInfo; className?: string }) {
  return (
    <div className={cn("w-[100px]", className)}>
      <div className="relative size-20 overflow-hidden rounded-2xl bg-avatar-empty lg:size-[100px] lg:rounded-[20px]">
        {member.photo && <Image src={member.photo.src} alt={member.photo.alt} fill sizes="100px" className="object-cover" />}
      </div>
      <p className="mt-4 text-lg leading-6 tracking-[-0.02em] text-black lg:mt-[15px] lg:whitespace-nowrap lg:text-[17px] lg:font-medium lg:tracking-[-0.05em]">{member.name}</p>
      <p className="mt-1 text-[13px] leading-4 text-role lg:mt-1.5 lg:tracking-[-0.06em]">{member.role}</p>
    </div>
  );
}

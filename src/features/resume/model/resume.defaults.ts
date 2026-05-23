import type { Resume } from "./resume.types";

function uid() {
    return Math.random().toString(36).slice(2, 10);
}

export function defaultResume(): Resume {
    return {
        meta: { version: 1 },
        basics: {
            applicationType: "",
            name: "",
            nameEn: "",
            birth: "",
            phone: "",
            email: "",
            address: "",
            title: "프론트엔드 개발자",
            summary: "",
        },
        education: [{ id: uid(), period: "", institution: "", major: "" }],
        certifications: [
            {
                id: uid(),
                acquiredAt: "",
                name: "",
                issuer: "",
            }
        ],
        experience: [{
            id: uid(),
            company: "",
            role: "",
            start: "",
            isCurrent: false,
            end: "",
            description: "",
        }],
        projects: [
            {
                id: uid(),
                name: "",
                period: "",
                stack: "",
                description: "",
                link: "",
            }
        ],
        links: [
            { id: uid(), label: "GitHub", url: "" },
            { id: uid(), label: "Portfolio", url: "" },
        ],
        skills: {
            primary: ["React", "TypeScript"],
            tools: ["Git", "Figma"],
        },
    };
}

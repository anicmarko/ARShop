"use client";

export type AdminColumn = {
    id: string;
    name: string;
    email: string;
    role: "OWNER" | "MANAGER";
    createdAt: string;
};

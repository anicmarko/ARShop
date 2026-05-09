import { ShieldX } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const UnauthorizedPage = () => {
    return (
        <div className="relative min-h-screen">
            <div className="absolute top-4 right-4">
                <UserButton afterSwitchSessionUrl="/" />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center px-4">
                <ShieldX className="h-12 w-12 text-muted-foreground" />
                <h1 className="text-2xl font-bold">Pristup odbijen</h1>
                <p className="text-muted-foreground max-w-sm">
                    Nemate dozvolu za pristup admin panelu. Kontaktirajte vlasnika prodavnice.
                </p>
            </div>
        </div>
    );
};

export default UnauthorizedPage;

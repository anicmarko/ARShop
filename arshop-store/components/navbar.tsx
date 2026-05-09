import Link from "next/link";
import Container from "@/components/ui/container";
import MainNav from "@/components/main-nav";
import MobileNav from "@/components/mobile-nav";
import getCategories from "@/actions/get-categories";
import NavbarActions from "@/components/navbar-actions";

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <div className="sticky top-0 z-50 border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm">
            <Container>
                <div className="relative px-4 sm:px-6 lg:px-8 flex h-16 items-center gap-2">
                    {/* Mobile hamburger */}
                    <MobileNav categories={categories} />

                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex lg:ml-0 gap-x-1 items-center"
                        aria-label="ARShop home"
                    >
                        <p className="font-bold text-xl tracking-tight text-gray-900 dark:text-zinc-100">
                            AR<span className="text-violet-600">Shop</span>
                        </p>
                    </Link>

                    {/* Desktop category nav — hidden on mobile */}
                    <div className="hidden lg:flex">
                        <MainNav data={categories} />
                    </div>

                    <NavbarActions />
                </div>
            </Container>
        </div>
    );
};

export default Navbar;

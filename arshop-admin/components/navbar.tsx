import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import { MainNav } from '@/components/main-nav';
import StoreSwitcher from '@/components/store-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import prismadb from '@/lib/prismadb';

const Navbar = async () => {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const stores = await prismadb.store.findMany({
        where: { userId }
    });

    // For MANAGERs who don't own any store, fetch the store they're assigned to
    let managerStore: { id: string; name: string } | null = null;
    if (stores.length === 0) {
        const adminRecord = await prismadb.admin.findFirst({
            where: { clerkId: userId },
            include: { store: true },
        });
        if (adminRecord?.store) {
            managerStore = { id: adminRecord.store.id, name: adminRecord.store.name };
        }
    }

    const isOwner = stores.length > 0;

    return (
        <div className='border-b'>
            <div className='flex h-16 items-center px-4'>
                <StoreSwitcher items={stores} isOwner={isOwner} managerStore={managerStore} />
                <MainNav className='mx-6' isOwner={isOwner} />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeToggle />
                    <UserButton afterSwitchSessionUrl='/' />
                </div>
            </div>
        </div>
    );
};

export default Navbar;

import { useEffect, useRef } from 'react';

import { usePage } from '@inertiajs/react';
import { toast, Toaster } from 'sonner';

import { type SharedData } from '@/types';

type FlashMessages = NonNullable<SharedData['flash']>;

const resolveMessage = (value: unknown): string | null => {
    if (value === null || value === undefined) {
        return null;
    }

    if (Array.isArray(value)) {
        return value.filter(Boolean).join('\n');
    }

    if (typeof value === 'string') {
        return value;
    }

    return String(value);
};

export function AppToaster() {
    const {
        props: { flash },
    } = usePage<SharedData>();
    const lastFlash = useRef<FlashMessages | null>(null);

    useEffect(() => {
        if (!flash || flash === lastFlash.current) {
            lastFlash.current = flash ?? null;
            return;
        }

        const successMessage = resolveMessage(flash.success);
        const errorMessage = resolveMessage(flash.error);

        if (successMessage) {
            toast.success(successMessage, { duration: 4000 });
        }

        if (errorMessage) {
            toast.error(errorMessage, { duration: 6000 });
        }

        lastFlash.current = flash;
    }, [flash]);

    return <Toaster position="bottom-right" richColors closeButton />;
}

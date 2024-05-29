/* eslint-disable react/prop-types,react/jsx-props-no-spreading */

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';

import { cn } from '~/common/utility';

/**
 * A React component that wraps a SwitchPrimitives.Root component to create a customizable switch element.
 * 
 * @param {object} props - The props for the Switch component.
 * @param {string} props.className - Additional classes to be applied to the switch element.
 * @param {object} props...props - Additional props to be spread on the SwitchPrimitives.Root component.
 * @param {React.Ref} ref - Reference to the switch element.
 * @returns {JSX.Element} A JSX element representing the switch component.
 */
const Switch = React.forwardRef(({ className, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(
            'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors',
            // focus
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
            // disabled
            'disabled:cursor-not-allowed disabled:opacity-50',
            // checked
            'data-[state=checked]:bg-gray-900 data-[state=unchecked]:bg-gray-200',
            // dark
            'dark:focus-visible:ring-gray-300 dark:focus-visible:ring-offset-gray-950',
            'dark:data-[state=checked]:bg-gray-50 dark:data-[state=unchecked]:bg-gray-500',
            className,
        )}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                'pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0 dark:bg-gray-950',
            )}
        />
    </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

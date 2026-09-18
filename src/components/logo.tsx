import clsx from 'clsx'
import { Link } from '@/i18n/navigation'

/**
 * The Leutheria mark, inlined from `Brand/logo-square.svg`.
 *
 * Illustrator exported the fills as CSS classes in a `<style>` block. Inside an
 * inline SVG those class names are global and would collide with anything else
 * on the page, so they have been resolved to literal `fill` attributes.
 *
 * The mark carries its own colours and stays legible on both the light and the
 * dark background, so — unlike a single-colour logo — no second tint is needed.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 1024 1024" aria-hidden="true" className={clsx('h-9 w-9 shrink-0', className)}>
            <g>
                <path
                    fill="#9FD07B"
                    d="M776.1,388.9c33.6-52.8,91.9-85,154.6-85c9.8,0.2,19.7,1.1,29.3,3.1 c-6.7,95.7-86.4,170-182.3,170h-1.6V820c-10.7,9.2-21.7,18.6-34,27.7V177.3c12.3,9.2,23.3,18.6,34,27.7V388.9z"
                />
                <g>
                    <path
                        fill="#9FD07B"
                        d="M399.2,369c-5.4-8.1-10.3-16.3-15-24.4c-4.9-5.4-9.6-11-14.3-16.6c9.6,157.3,137.8,280.8,295.1,280.8 c16.1,0,32.2-1.6,47.9-4.7c-2.2-39.1-12.1-77.6-29.1-113.2C576.3,506.2,464.5,462.8,399.2,369z"
                    />
                    <path
                        fill="#6BBA63"
                        d="M384,344.4c4.7,8.1,9.6,16.3,15,24.4c65.5,93.7,177.2,137.1,284.6,121.7c-9.6-20.1-21.5-38.9-35.3-56.4 C552.2,449.8,452,417.8,384,344.4z"
                    />
                    <path
                        fill="#327571"
                        d="M417.7,322.5c-13.9,0-27.5,1.1-41.2,3.4c-2.2,0.4-4.5,0.9-6.7,1.1c0,0.2,0,0.4,0,0.7 c4.5,5.8,9.4,11.4,14.3,16.6c68,73.4,168.2,105.1,264.2,89.7C592.7,363.7,507.7,322.5,417.7,322.5z"
                    />
                </g>
                <g>
                    <path
                        fill="#327571"
                        d="M130.3,286.9c7.6,56.4,24.2,111.2,49.4,162.2c-4.9,20.8-7.6,42.1-7.6,63.3 c-32.4,57.3-55.7,122.1-63.3,190.2c-29.3-57.3-44.7-122.1-44.7-190.2C62.7,432.3,85.8,353.6,130.3,286.9z"
                    />
                    <path
                        fill="#6BBA63"
                        d="M442.6,97C369.9,146.4,309.7,212.9,271,291.6c-45.6,42.1-77.4,97.1-91.3,157.7 c-24.8-49.4-43.2-105.1-49.4-162.2C199.8,179.1,314.8,109.1,442.6,97z M172.1,512.6v6.3c0,98.9,46.3,185.5,117.4,242.7 c40.5,68.7,96.6,127.1,163.8,170c-147-10.7-277.6-97.5-344.5-228.9C116.2,635.5,137.9,570.8,172.1,512.6z"
                    />
                    <path
                        fill="#9FD07B"
                        d="M666.7,267l2.5,0.2c12.5,9.4,24.4,19.7,35.3,30.9V155.4C637.9,114,560.9,92.1,482.6,92.3 c-13.6,0-27.1,1.6-40.3,4.7C369,145.5,309.7,212.9,270.8,291.6c57.3-53.9,133.1-83.9,211.9-83.4 C552.2,208.2,615.5,229.9,666.7,267z"
                    />
                    <path
                        fill="#9FD07B"
                        d="M704.3,737.7C591.1,849.1,412.6,858.5,288,760.1c40.3,69.6,97.3,126.8,163.8,170c10.3,1.3,20.6,1.8,30.9,1.6 c78.3,0.2,155-21.5,221.7-62.6V737.7z"
                    />
                </g>
            </g>
        </svg>
    )
}

/** Mark + wordmark, doubling as the home link in the header. */
export function Logo({ label }: { label: string }) {
    return (
        <Link
            href="/"
            aria-label={label}
            className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
        >
            <LogoMark />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">Leutheria</span>
        </Link>
    )
}

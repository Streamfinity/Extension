/**
 * @param e
 * @param className string[]
 */
export default function imageOnError(e, className = []) {
    e.target.onError = null;
    e.target.classList.add('text-transparent', ...className);
}

/** Base-path aware URL helper. Always use this for internal links and /public assets. */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL || '/';
  const clean = String(path).replace(/^\/+/, '');
  return (base.endsWith('/') ? base : base + '/') + clean;
}
/** Public URL of a theme page. */
export const themeUrl = (id: string) => withBase(`s/${id}/`);
export const cleanUrl = () => withBase('clean/');
export const galleryUrl = () => withBase('gallery/');

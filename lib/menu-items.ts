type MenuItemIdentity = {
  id?: string | null;
  name: string;
  slug?: string | null;
  category?: string | null;
};

export function slugifyMenuValue(value: string | null | undefined) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getMenuItemSlug(item: Pick<MenuItemIdentity, "name" | "slug">) {
  return slugifyMenuValue(item.slug) || slugifyMenuValue(item.name);
}

export function isMenuItemSlug(
  item: Pick<MenuItemIdentity, "name" | "slug">,
  requestedSlug: string,
) {
  const normalizedRequest = slugifyMenuValue(requestedSlug);

  return (
    slugifyMenuValue(item.slug) === normalizedRequest ||
    slugifyMenuValue(item.name) === normalizedRequest
  );
}

export function getMenuItemIdentity(
  item: Pick<MenuItemIdentity, "name" | "category">,
) {
  return `${slugifyMenuValue(item.category)}::${slugifyMenuValue(item.name)}`;
}

export function deduplicateMenuItems<Item extends MenuItemIdentity>(
  items: Item[],
) {
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();
  const seenProducts = new Set<string>();

  return items.filter((item) => {
    const id = item.id?.trim();
    const slug = slugifyMenuValue(item.slug);
    const productKey = getMenuItemIdentity(item);

    if (
      (id && seenIds.has(id)) ||
      (slug && seenSlugs.has(slug)) ||
      (productKey !== "::" && seenProducts.has(productKey))
    ) {
      return false;
    }

    if (id) seenIds.add(id);
    if (slug) seenSlugs.add(slug);
    if (productKey !== "::") seenProducts.add(productKey);
    return true;
  });
}

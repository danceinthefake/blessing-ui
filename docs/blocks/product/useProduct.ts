import { computed, onMounted, ref, watch } from "vue";
import type { ProductApi, Related } from "./api";
import { missing, skuOf, soldOut, starCounts, type Product, type Selection } from "./domain";

/** the product, the choice of variant and quantity, and Add to cart */
export function useProduct(api: ProductApi, id: string) {
  const product = ref<Product>();
  const related = ref<Related[]>([]);
  const selection = ref<Selection>({});
  onMounted(async () => {
    [product.value, related.value] = await Promise.all([api.product(id), api.related(id)]);
    selection.value = { color: product.value.options[0].values[0].value };
  });

  // the options with sold-out flags for the choices made so far, as BlessVariantPicker wants them
  const options = computed(() =>
    (product.value?.options ?? []).map((o) => ({
      ...o,
      values: o.values.map((v) => ({
        ...v,
        soldOut: soldOut(product.value!, selection.value, o.key, v.value),
      })),
    })),
  );
  // a new color can sell out the chosen size: drop the size, so the shopper picks again
  watch(
    () => selection.value.color,
    () => {
      const { size, ...rest } = selection.value;
      if (size && soldOut(product.value!, rest, "size", size)) selection.value = rest;
    },
  );
  const photos = computed(() => product.value?.photos[selection.value.color] ?? []);
  const counts = computed(() => starCounts(product.value?.reviews ?? []));
  const stars = ref<number>();
  const reviews = computed(() =>
    (product.value?.reviews ?? []).filter((r) => !stars.value || r.stars === stars.value),
  );

  const quantity = ref(1);
  const problem = ref("");
  const adding = ref(false);
  /** resolves true when the item is in the cart */
  async function add() {
    const p = product.value!;
    problem.value = missing(p, selection.value);
    if (problem.value) return false;
    adding.value = true;
    try {
      await api.addToCart(skuOf(p, selection.value), quantity.value);
      return true;
    } catch (e) {
      problem.value = (e as Error).message;
      return false;
    } finally {
      adding.value = false;
    }
  }

  return {
    product,
    related,
    selection,
    options,
    photos,
    counts,
    stars,
    reviews,
    quantity,
    problem,
    adding,
    add,
  };
}

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { CATEGORIES, filterProducts, formatPrice, productImage, productsQuery } from "@/lib/store";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dolls Luxury — Modern Minimalist Clothing" },
      { name: "description", content: "Shop Dolls Luxury: refined tops, bottoms and dresses, made to your size or measurements." },
      { property: "og:title", content: "Dolls Luxury — Modern Minimalist Clothing" },
      { property: "og:description", content: "Refined tops, bottoms and dresses, made to your size or measurements." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Index,
  errorComponent: StoreUnavailable,
});

function StoreUnavailable({ reset }: { reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-6 py-32 text-center">
        <p className="eyebrow">Dolls Luxury</p>
        <h1 className="mt-4 text-4xl">The collection is taking a short break.</h1>
        <p className="mt-4 text-sm text-muted-foreground">We couldn't load our pieces just now. Please try again in a few minutes.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-8 bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground"
        >Try again</button>
      </section>
      <SiteFooter />
    </div>
  );
}

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => filterProducts(products, cat, q), [products, cat, q]);
  const featured = products.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative">
        <img src={hero} alt="Dolls Luxury featured outfit" width={1600} height={1008} className="h-[78vh] w-full object-cover object-[30%_center]" />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="mr-6 max-w-md text-left md:mr-24">
            <p className="eyebrow text-foreground/70">New Season</p>
            <h1 className="mt-4 text-6xl leading-[0.95] md:text-8xl">Quiet<br />elegance.</h1>
            <p className="mt-6 text-sm text-foreground/80">Considered pieces, cut to your size — or your exact measurements.</p>
            <a href="#collection" className="mt-8 inline-block bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition hover:bg-blush">Shop the collection</a>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-20">
          <p className="eyebrow">Featured outfits</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {featured.map((p) => (
              <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group relative overflow-hidden">
                <img src={productImage(p)} alt={p.name} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-6 text-primary-foreground">
                  <p className="font-display text-2xl">{p.name}</p>
                  <p className="text-sm">{formatPrice(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="collection" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-12">
        <div className="flex flex-col gap-6 border-b pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 className="mt-2 text-4xl">Shop all</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.2em]">
              {["All", ...CATEGORIES].map((c) => (
                <button key={c} onClick={() => setCat(c)} className={cat === c ? "border-b border-foreground pb-1" : "pb-1 text-muted-foreground hover:text-foreground"}>{c}</button>
              ))}
            </div>
            <label className="flex items-center gap-2 border-b px-1 py-1">
              <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" maxLength={60} className="w-40 bg-transparent text-sm outline-none" />
            </label>
          </div>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group">
              <div className="overflow-hidden bg-muted">
                <img src={productImage(p)} alt={p.name} loading="lazy" className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-4 flex items-start justify-between gap-2">
                <div>
                  <p className="font-display text-lg leading-tight">{p.name}</p>
                  <p className="eyebrow mt-1">{p.category}</p>
                </div>
                <p className="text-sm">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && <p className="col-span-full py-16 text-center text-sm text-muted-foreground">No pieces match your search.</p>}
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

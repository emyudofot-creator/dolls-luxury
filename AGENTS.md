<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public product queries use an explicit column allowlist; private cost prices are read through an admin-checked RPC to prevent exposing costs to shoppers.
- Checkout inventory deductions and sale cost snapshots run atomically in the database with ordered row locks to prevent overselling and preserve historical margins.
- Admin accounting uses shared query options and pure analytics calculations; completed order status determines recognized revenue, and missing legacy costs remain unknown.

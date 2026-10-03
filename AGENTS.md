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

- Keep the prototype's scenario state in a shared React provider and its deterministic illustrative calculations in a pure module, so pages agree without implying live forecast or database persistence.
- Use separate TanStack content routes for overview, dashboard, shipment entry, and results so each stage is shareable and has its own metadata.

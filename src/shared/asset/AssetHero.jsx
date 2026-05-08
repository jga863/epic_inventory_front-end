import ModuleHero from "../components/module/ModuleHero";

/**
 * Title + description + action + stats banner shown at the top of an AssetPage.
 * Uses the same visual composition as ModuleHero so module pages stay consistent.
 */
function AssetHero({ title, description, action, stats = [] }) {
  return (
    <ModuleHero
      eyebrow="Epic Inventory"
      title={title}
      description={description}
      action={action}
      stats={stats}
    />
  );
}

export default AssetHero;

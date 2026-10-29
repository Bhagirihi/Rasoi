import RecipeForm from '@/app/admin/(console)/recipes/RecipeForm';

export default function NewRecipePage() {
  return (
    <RecipeForm
      mode="create"
      pageTitle="Add recipe"
      pageDescription="Craft a new dish, preview on mobile, then confirm to publish live."
    />
  );
}

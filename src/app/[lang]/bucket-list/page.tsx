import BucketListForm from "@/components/BucketListForm";

export default async function BucketListPage(props: { params: Promise<{ lang: string }> }) {
  await props.params;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
          My Mauritius Bucket List
        </h1>
        <p className="text-muted-foreground mb-8">
          Plan your perfect trip to Mauritius. Select your interests and dates to get started.
        </p>
        <BucketListForm />
      </div>
    </div>
  );
}

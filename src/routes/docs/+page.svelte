<script lang="ts">
  import InfoDialog from "$lib/components/info-dialog.svelte";
  import DocListHashtags from "$lib/docsComponents/doc-list-hashtags.svelte";
  import DocListNaddrShare from "$lib/docsComponents/doc-list-naddr-share.svelte";
  import DocListSlugSame from "$lib/docsComponents/doc-list-slug-same.svelte";
  import DocListSlug from "$lib/docsComponents/doc-list-slug.svelte";
</script>

<div class="common-container-3xl common-ring">
  <div class="common-container-content w-full">
    <div class="prose max-w-none text-left">
      <div class="text-left">
        <h1 class="text-3xl md:text-4xl font-bold mb-8">Nostree Documentation</h1>
        
        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4">Getting Started</h2>
          <p class="mb-6">
            Nostree is a Nostr-based link list platform that lets you create and share collections of links. Think of it as a decentralized link-in-bio tool where you own your data.
          </p>
          
          <h3 class="text-xl md:text-2xl font-semibold mb-4">Quick Start</h3>
          <ol class="list-decimal pl-6 mb-6 space-y-2">
            <li>Connect with your Nostr key (using a browser extension or by entering your nsec)</li>
            <li>Create a new list by clicking the "+" button</li>
            <li>Add links to your list</li>
            <li>Share your list using your Nostr address</li>
          </ol>
        </section>

        <hr class="my-4" />

        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4 mt-8">Tips & Best Practices</h2>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>Use clear, descriptive titles for your links</li>
            <li>Add relevant hashtags to improve discoverability</li>
            <li>Keep your lists focused and organized</li>
            <li>Update your lists regularly to keep them relevant</li>
            <li>Use the share features to reach your audience</li>
          </ul>
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4 mt-8">Creating Lists</h2>
          <p class="mb-6">
            Lists are the core feature of Nostree. Each list is a collection of links that you can share with others.
          </p>
          
          <h3 class="text-xl md:text-2xl font-semibold mb-4">Create New List</h3>
          <div class="space-y-8">
            <div class="space-y-4">
              <p class="text-lg">Lists are a way to organize your links.<br>
                You can create, edit and manage them in the <a href="/manage" class="font-medium">Manage page</a>.</p>
              
              <div class="pl-4 space-y-6">
                <div>
                  <h4 class="font-semibold mb-2">Form Fields</h4>
                  <ul class="space-y-2 pl-4">
                    <li><span class="font-medium">Title</span> - Name your list</li>
                    <li><span class="font-medium">Links</span> - Add URLs with descriptions (two fields per link)</li>
                    <li><span class="font-medium">Slug</span> - Optional custom URL (auto-generated if empty)</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-semibold mb-2">Form Controls</h4>
                  <ul class="space-y-2 pl-4">
                    <li><span class="font-medium">+</span> - Add more link fields</li>
                    <li><span class="font-medium">↻</span> - Reset the form</li>
                    <li><span class="font-medium">Publish</span> - Save and publish your list</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-semibold mb-2">Managing Lists</h4>
                  <p class="mb-2">Your existing lists appear under 'All Lists' with these options:</p>
                  <ul class="space-y-2 pl-4">
                    <li><span class="font-medium">✎</span> - Edit list content</li>
                    <li><span class="font-medium">⭐</span> - Feature list (moves to top)</li>
                    <li><span class="font-medium">🗑</span> - Delete list</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <DocListHashtags />
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <DocListSlugSame />
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <DocListNaddrShare />
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4 mt-8">Managing Multiple Lists</h2>
          <div class="space-y-8">
            <div class="space-y-4">
              <p class="text-lg">Once you've created multiple lists, you can easily manage them all in one place.<br>
                Access your lists through the dropdown menu labeled 'All Lists'.</p>
              
              <div class="pl-4 space-y-6">
                <div>
                  <h4 class="font-semibold mb-2">List Actions</h4>
                  <ul class="space-y-2 pl-4">
                    <li><span class="font-medium">Edit</span> - Modify list content and settings</li>
                    <li><span class="font-medium">Feature</span> - Pin list to the top position</li>
                    <li><span class="font-medium">Delete</span> - Remove list permanently</li>
                  </ul>
                </div>

                <div>
                  <h4 class="font-semibold mb-2">List Organization</h4>
                  <ul class="space-y-2 pl-4">
                    <li><span class="font-medium">Personal links</span> - For your personal bookmarks</li>
                    <li><span class="font-medium">Professional resources</span> - Work-related links</li>
                    <li><span class="font-medium">Topic collections</span> - Subject-specific lists</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr class="my-8">

        <section class="mb-12">
          <h2 class="text-2xl md:text-3xl font-semibold mb-4 mt-8">Technical Details</h2>
          <p class="mb-4">
            Nostree uses the Nostr protocol to store and share your lists. This means:
          </p>
          <ul class="list-disc pl-6 mb-6 space-y-2">
            <li>Your data is decentralized and portable</li>
            <li>You maintain control of your content</li>
            <li>Lists are synchronized across Nostr relays</li>
            <li>Compatible with other Nostr clients that support the format</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</div>
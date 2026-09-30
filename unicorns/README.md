# Unicorn gallery

Static Dutch-language gallery served at `/unicorns/` by GitHub Pages. No build step or dependencies. Serve the repository with `python3 -m http.server` for local preview. The LAN preview uses port 8000 with `--bind 0.0.0.0`.

Add pictures to `images/` and entries to the `unicorns` array in `gallery.js`. Keep stable IDs for future favorites. All image requests are local. Fullscreen uses the browser API when available; otherwise the layout fills the browser viewport.

## Artwork

Ten realistic fantasy scenes downloaded from StockCake, including the user's supplied reference as the first image. These are AI-created fantasy images. StockCake releases its AI images under [CC0 / public domain](https://stockcake.com/info/license). The app's “Over de plaatjes” dialog links to the source page where available, otherwise the original image. Downloads are hosted locally and shown uncropped.

| Local asset | Source | Original download |
| --- | --- | --- |
| star-flight.jpg | [Source](https://stockcake.com/i/mystical-flying-unicorn_1030068_824810) | [JPEG](https://images.stockcake.com/public/3/7/8/378bbf10-1576-4616-8f26-f08fc5971cd1_large/mystical-flying-unicorn-stockcake.jpg) |
| rainbow-waterfall.jpg | [Source](https://stockcake.com/i/majestic-winged-unicorn_671828_124980) | [JPEG](https://images.stockcake.com/public/0/8/8/088078ff-5f11-466e-a370-0b7acf6ac5f8_large/majestic-winged-unicorn-stockcake.jpg) |
| rainbow-clouds.jpg | [Source](https://stockcake.com/i/majestic-unicorn-magic_176901_30135) | [JPEG](https://images.stockcake.com/public/0/e/7/0e7de3bf-eb34-45d8-9a14-98ffc592e6a3_large/majestic-unicorn-magic-stockcake.jpg) |
| mountain-magic.jpg | [Source](https://images.stockcake.com/public/1/d/0/1d0111fb-7b44-443a-a790-04ccab109970_large/majestic-unicorn-summit-stockcake.jpg) | [JPEG](https://images.stockcake.com/public/1/d/0/1d0111fb-7b44-443a-a790-04ccab109970_large/majestic-unicorn-summit-stockcake.jpg) |
| rainbow-friends.jpg | [Source](https://stockcake.com/i/majestic-unicorns-galloping_370949_65765) | [JPEG](https://images.stockcake.com/public/f/5/c/f5caa698-7f52-4196-900f-b10fc1ed5035_large/majestic-unicorns-galloping-stockcake.jpg) |
| moon-flight.jpg | [Source](https://stockcake.com/i/majestic-winged-unicorn_965967_786590) | [JPEG](https://images.stockcake.com/public/5/9/a/59a8aabf-5e1a-4670-93af-ec72c34a3dae_large/majestic-winged-unicorn-stockcake.jpg) |
| forest-flight.jpg | [Source](https://images.stockcake.com/public/3/f/b/3fbfff97-0ba5-4f10-ba9f-01cefb89db4a_large/mystical-winged-unicorn-stockcake.jpg) | [JPEG](https://images.stockcake.com/public/3/f/b/3fbfff97-0ba5-4f10-ba9f-01cefb89db4a_large/mystical-winged-unicorn-stockcake.jpg) |
| flower-flight.jpg | [Source](https://images.stockcake.com/public/b/f/6/bf64c491-df90-40ce-9e7a-c3cad8621e9a_large/majestic-unicorn-flying-stockcake.jpg) | [JPEG](https://images.stockcake.com/public/b/f/6/bf64c491-df90-40ce-9e7a-c3cad8621e9a_large/majestic-unicorn-flying-stockcake.jpg) |
| twilight-flight.jpg | [Source](https://images.stockcake.com/public/c/9/7/c971524a-c562-4975-acc0-aa627dbc78b1_large/magical-flying-unicorn-stockcake.jpg) | [JPEG](https://images.stockcake.com/public/c/9/7/c971524a-c562-4975-acc0-aa627dbc78b1_large/magical-flying-unicorn-stockcake.jpg) |
| golden-forest.jpg | [Source](https://stockcake.com/i/mystical-forest-unicorn_900293_1030994) | [JPEG](https://images.stockcake.com/public/9/8/c/98c51af3-c5db-4844-a59b-d3de28f83d1e_large/mystical-forest-unicorn-stockcake.jpg) |

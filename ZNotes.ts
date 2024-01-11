// prettier-ignore
//#region // < LMS Platform: Next 13, React, Stripe, Mux, Prisma, Tailwind, MySQL | Udemy Clone
/*
1- the prgress bar
. 2- the navigation side bar with background and an indicator stripe
3- the alart banner
4- how to track the video watch time progress
5- confitty animation
. 6- drag and drop reordering
. 7- rich text editor
. 8- multi step form, 
. 9- image upload with upload thing, also there are video and files upload
. 0- clerk auth
*/
//#endregion
//#region // < Daily Notes
//#region // < 8-1-2024
/*
1- In tailwind you can control both the ring and ring-offset colors and widths
2- while doing the active href track, manage both exact match and nested child routes
3- clerk auth
  - follow the docs
  https://clerk.com/docs/quickstarts/nextjs
*/
//#endregion
//#region // < 9-1-2024
/*
1- if you wanna consistency between all of the childs of a container, use grid. If you wanna the childs to take only the space they need, use flex
  no this is wrong, flex should be able to stretch it's child even if we didn't specify the height explicitly
    this is a css mestery, envolving, fixed 'change in the context flow' and other stuff
2- in radixUI adding asChild on the parent will pass both the aria-labels and the styles to the child
3- you should be carful with ignored files while moving arround in git history
  I ignored 2 files then I chicked out an old commit, did some changes that I didn't wanna save, so to be able to git back, I had to discard these changes, while doing that I deleted the 2 ignored files, as they weren't ignored in the old commit, so git removed them while discarding the changes, as they were considered as new files, then when I came back to the latest commit, I found that the 2 files are gone, and there is no way to get them back, as they were never tracked by git
*/
//#endregion
//#region // < 10-1-2024
/*
1- never use the UserButton from clerk, as it makes two http requests on the client to get the user data, and each request takes at leas 250ms, the http request also returns a huge payload full of unneeded data
2- This is the best setup for file uploades I have looked at so far, looks like I'll be sticking to uploadthing instead of cloudinary, 'I never used the other options cloudinary provides anyway'
3- multi step form, It's actually a set of separate forms, each one is calling it's own endpoint
*/
//#endregion
//#region // < 11-1-2024
/*
1- react-beautify-dnd is no longer maintained, so we used '@hello-pangea/dnd'
  the way it works is like this
    - you create a dnd context that will wrap what can be dragged and where it can be dropped
    - inside you create a droppable zone
    - inside you create a draggable item
    - inside you create a handle for the draggable item 'this handle will be used to drag the item arround'
      along side the drag handle you can have normal elements
        > this is How the functionality works

  Now we need to update the list order state, and also if we need to persist the order, we need to send a request to the server to update the position of the changed items, 
    and we don't make a request for all the list, we wanna just send a request for the itmes that changed position only
      this may be a bit complicated, but just grap the logic from this project, it's working fine

2- the rich text editor
  - using what quill provides out of the box is enough for text editing, and setting it up was pretty easy
  - if you wanna add images and links preview, you need to use Editor.JS from the Rooms Project
    to set it up
      1- we prevent it from rendering on the server 'ssr: false'
      2- we have to components, one for editing 'Editor' and one for previewing 'Preview'
      3- note that we import some CSS files during the setup

  - Notes
    1- rendering it with no ssr, we had to calculate the epected height of the text preview, and assign a space for it, so the page doesn't jump when the editor is rendered 'cumulative layout shift'
    2- rendering it with ssr, will cause an error that will cause the hole page to be rendered on the client only, 'the ssr will be a blank page'
    3- we can customize some of the styles using the css classes provided by quill
      .ql-container {
        font-size: 16px !important;
      }

3- Video Uploading
  1- we upload the video to uploadthing and get the URL
  2- we create a new MUX Video.Asset using the URL
  3- we store the assetId and playbackId in the database
    assetId is used to delete the video if needed, and playbackId is used to play the video using the MUXPlayer component
  4- we use the MUXPlayer component to play the video
    this component have alot of events, like onEnded, and I think we can track the watch time using these events
  5- I think after we create the Video.Assets on MUX we can delete the video from uploadthing, as we don't need it anymore
    MUX should be storing the video and creating the different qualities for us

    using the free teer with no credit card, you are limited to 10sec videos and a huge watermark, you can enter your credit card and get a generous much more free teer, but you will be charged if you exceed the free teer limits

*/
//#endregion
//#endregion



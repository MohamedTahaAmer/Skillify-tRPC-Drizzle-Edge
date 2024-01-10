// prettier-ignore
//#region // < LMS Platform: Next 13, React, Stripe, Mux, Prisma, Tailwind, MySQL | Udemy Clone
/*
1- the prgress bar
. 2- the navigation side bar with background and an indicator stripe
3- the alart banner
4- how to track the video watch time progress
5- confitty animation
6- drag and drop reordering
7- rich text editor
8- multi step form
9- image upload with upload thing, also these is video and files upload
0- clerk auth
*/
//#endregion
//#region // < 0- clerk auth
/*
1- follow the docs
  https://clerk.com/docs/quickstarts/nextjs
*/
//#endregion
//#region // < Daily Notes
//#region // < 8-1-2024
/*
1- In tailwind you can control both the ring and ring-offset colors and widths
2- while doing the active href track, manage both exact match and nested child routes
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
*/
//#endregion
//#endregion



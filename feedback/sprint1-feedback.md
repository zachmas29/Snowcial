# Sprint 1 feedback

(X) tagged commit on main for sprint1
( ) set of closed user stories
(X) working deployment 
(X) GitHub reports build passing
( ) team members have completed reflection
(X) demo

## Checklist notes

Casy was the sole member of the team to compete the sprint reflection. I have nothing from Cam, Ned, Toby, or Zach

I am looking at your sprint 1 done pile and I don't see any user stories. I see to-do list items

Github reports that the tests are passing, but this is slightly misleading as you don't really have any...

## Discussion

### User stories

All of your user stories are still locked up in your list of Epics. Many of them are indeed epics, but some are at the level of feature and we should be seeing them in sprint backlogs. Some have justification, some do not. I also see an "as a developer" story in there, which I hope is just in there to yank my chain, right? I am also not seeing much in the way of adjusting to my comments from the last sprint feedback. 


To take one example, let's look at #5: "As someone without a car, I want to find people who are going to ski and willing to give me a ride at a time I would like to ski". That one doesn't really have the justification spelled out, but we can imply it. This is not a bad epic, but there is a lot to be done flesh this out. What is the anticipated timeline, is this person expecting to be able to find someone driving out tomorrow, or are they interested in posting requests for rides? Where is the other side, why would someone with a car want to offer rides? This is the drum that I have been banging on for a little while with your group. You need to get detailed. That doesn't mean that the interface needs to be very granular. It is quite possible that the end result is to mirror a bulleting board with little notes posted on it. But if you don't nail down why someone would post or view (or comment?) you are going to miss a lot of things. 

My real fear for you is that you are viewing the user stories as busy work that is disconnected from the "real" work. I say this because while your group has generally been better at producing user stories, I don't see much of a connection at all between your user stories and the site you have produced. The only real content right now is a page with little user profile cards. It looks good, but what user stories does it support? I see

- want to have a profile that shows my _hobbies_ and _interests_ and _available times (#3)
- I want to see a list of people who share similar interests / availabilities (#4)
- I want to be able to add a gallery of photos to my profile (#11)
- I want to add tags to my profile so people can see my interests / maybe filter (#12)

I don't see any of those captured by cards with quick blurbs. That isn't to say that the name, contact, blurb is a bad design! But that isn't what you said you wanted. It also implies more things that aren't in your design or your current framework. What are those usernames for? Is there in app communication? That would be a lot of work and it isn't anywhere in your user stories. For that matter, none of your user stories have anything to say about how your users will coordinate either... (not that this needs to be supported in app, you could leave it for the comment feed, but you need to justify/design for whatever it is)

### Agility/scrum

Looking at your pattern of commits, I see a pretty consistent pattern of commits over the sprint instead of a big rush at the end. On your backlog items I see evidence that you scored them and assigned work to different team members, which all looks good. Now we just need some more thought given to the content of the items. 


### Integration

I am seeing a good collection of PRs with some non-trivial feedback in there. Good job on that. You have a number of branches in flight at the moment. That is worth keeping a check on. Do you need them all, should some be deleted because their work is done? There are enough that I worry that they will lead to duplicated or stale work.

### Implementation

Your implementation looks pretty clean, though there is not a ton of code in here yet. The biggest falling down point is that you have not written any tests. Try practicing TDD, making tests that specify the requirements before you dive into the coding. 

### Functionality

It is still early days, and I think you did a good job with getting a framework up with MUI and Supabase. However, as I said above, I worry that the only piece of functionality you actually created is not something on the list of things you said you wanted, and it is in pretty minimal form. The next sprints are going to fly by. I've been vocal about challenging your group on what an "event" is and how that would manifest itself in the application. A better approach that showed off the _core_ functionality of your app would have been to work on the event feed/view. I can imagine a world in which the application allowed anonymous posting without associated profiles (I wouldn't recommend it, but can imagine it), can we say the same about an application that is just profiles?


### Final thought

I think you really need to hammer down your design. Revisit your epics and see what of them you think are still where you want to go. Look for the ones that aren't justified. Make sure you really know why someone is going to post something on your site and the kind of thing they are going to post. 
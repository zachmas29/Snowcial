# Sprint 2 feedback

(X) tagged commit on main for sprint2
(X) set of closed user stories
(X) working deployment 
(X) GitHub reports build passing
(-) team members have completed reflection
(X) demo

## Checklist notes

 Zach has not completed the reflection

## Discussion

### User stories

The user stories are much improved from the last sprint. I am seeing more specificity and even some details in the comments. Good job. 


### Agility/scrum

There was a definite uptick in the commits in week two of the sprint. it looks like you are making good use of your backlog as well. 



### Integration

I am seeing good use of the pull requests. Everything is checked by someone and _most_ of the commits haven't broken the build (that should fall to zero). I see that you started having copilot help review the PRs. That seems like a good use of copilot. 

There are a couple of active branches, but it doesn't look like you have zombie branches that should be killed. 


### Implementation

As an example of how AI can actually help you in a positive way, I have provided a code review created by copilot in this feedback folder. My prompt: "I would like a code review performed on the project in project-burgundy-binturong. In particular I would like to know about idiomatic use of React and Next, any signs of leaky abstractions and any potential build up of technical debt. Write the contents of this review into the open sprint2-Copilot-review.md. 

_Your group seems to have started down this path already, but I am doing this for all groups._

Copilot thinks you are doing pretty well and I agree. I would certainly take a few moments to go after the "quick wins" listed in the review, and it is worth looking at the ideas for improving the auth flow and the queries if you have time. 

I am seeing some good testing in your code as well. Keep it up!



### Functionality

It looks like you are in a pretty good place in your functionality, though you have left yourselves with a lot more to do. I have three comments after poking around in the site. 

The first is that navigation could be improved. After clicking into an event or a bio, there is no way back. yes, I know that the tab buttons on the bottom will "go back" (as will the back button), but it is better to have an interface element that helps the user see that they can go back. The last thing you want is for the user to think they have made a choice they can't undo. The other thing about using the tab buttons at the bottom is that they will take the user back to the top of the page which always makes me reluctant to click deeper in. On the events list, I'm not even sure why you bother since there is no new information available in the individual view (at least not yet). The single card also makes it look like it is a modal dialog that one can get out of by clicking the background. 

That brings me to the second comment. You have a lot of interface elements that don't currently do anything. Examples include the tags on everything, the number of people attending, the gallery, etc. I feel a little mixed about this. On the one hand, this is iterative development, but, only if those features are going to be fully fleshed out. it is easy to fall into the trap of doing a lot of work that is not actually supporting future development (or actively impedes it). 

My third comment is general usability issue. I see that you have overloaded the "new" tab on the bottom to both add new events and edit the profile. This is a somewhat confusing approach. This is not where I would expect to be able to edit the profile. I think you would be better served by having an edit button in the profile itself so that button always does the same thing no matter which panel you are currently looking at. 

### Final thought

Your team is doing very well. You are proceeding at a good pace and following good development practices. If you continue in this vein I think you will be in a good place at the end of the sprint. 
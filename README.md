This module a number of components for preserving flow page positions between outcome calls.

Normally flow looses your croll position and selected tab when moving through outcomes, this stops that.

# Class Names

ScrollKeeper & TabKeeper

# ScrollKeeper

Pop this component on your page and it will search up the DOM to find the first div which is scrollable.

It then stores the current scroll position into local storage when navigating away from the page and restores that position when re-displaying the page again.

Normally just drop one on the main container.

No config required apart from setting the "ComponentType"="ScrollKeeper";

# TabKeeper

Pop this component into any child container inside a "Group" container.

It then stores the current selected tab into local storage when navigating away from the page and restores that tab when re-displaying the page again.

No config required apart from setting the "ComponentType"="TabKeeper";


# Google Tag Manager (GTM) Adapters for Embedded Content
This repository contains adapters for sending interaction data to the GTM dataLayer for various types of embedded content such as: Live Chat, Video, Forms, Meetings etc...

**These adapaters are meant to push data in an abstract/reusable format.** They are built to send raw data into the dataLayer for use inside various tags and triggers via variables. As such, the adapters in this repository will __never__ be configured to send data directly to a certain adtech/martech platform or TMS.

## Styles & Conventions
**These are opinionated style preferences for the sake of maintaining this repository.** Each adapter should be easy to configure to your own preferences if the default formats do not match your specific implementation requirements.

### dataLayer Global
It is assumed that the website/appication is using the default `window.dataLayer` global. Changing the default dataLayer global variable is uncommon. However, if the dataLayer *has* been customized, the adapters will not work without modifying the dataLayer references in each script. 
### dataLayer Event Names

Event names are *typically* in the following format:

`{{namespace}}.{{object}}_{{action}}`

The **`{{object}}_{{action}}`** portion of the event name is always formatted in `snake_case`.

**`{{namespace}}`** is *typically* the lowercase name of the platform the adapter is written for (e.g. `hubspot`). This value is usually stored in a `namespace` variable for easy customization if desired.

**`{{object}}`** is typically a static value prefix for what kind of embedded object the event is describing (e.g. `form` or `chat`).

**`{{action}}`** is a highly variable value that describes the action taking place (e.g. `submit` or `start`, `complete`). These values are usually derrived from the events emitted from the embedded content via a mapping inside the adapter.

Each adapter should contain a comment that lists the event names assuming the default configuration is used.

#### Exceptions
Certain kinds of adapters may choose to push data to GTM in a format that is used by built-in triggers and variables (this is fairly common with video adapters). This often times is done to simplify the use of the data without needing to create excess variables and triggers. 

## How to Use
Each adapter in this repository should be a stand-alone file ready for use inside a Custom HTML tag. Most of these adapters will load once per-page using an All Pages (or similar) trigger type. Adapters with specific implementation requirements or caveats will include implementation notes at the top of the file.

It is not required to implement these adapters with GTM. They can be included as part of a website/applications main script files if desired. 

### What events are sent?
Every adapter will have different event names depending on the functionality of the content being interacted with. Additionally, each adapter should contain a comment that lists the event names sent to GTM assuming the default configuration is used. This comment is likely near the `dataLayer.push()` command where the event name is defined.

## Browser Support
These adapters do not polyfill any unsupported APIs for older browsers such as Internet Explorer. **It is the implementors responsibility to polyfill if needed.** 

### A Note About ES6/2015
**GTM does NOT currently support ES6/2015 syntax inside Custom HTML tag types**. These adapters are meant to be simple, lightweight, and ready-to-use. No tooling should be required to transpile them into a production ready format. As such, all adapters written for this repository should use ES5 syntax and not ES6/2015 syntax until GTM provides ES6/2015 support.

## Dependencies
The adapters in this repository should be using stable & well supported native browser APIs (e.g. vanilla Javascript without other JS library dependancies such as jQuery). The exception to this rule is for particular adapters that utilize their own libraries from the embeddable content themselves (e.g. Marketo's forms JS api requires the use of methods provided by its own library). These kinds of dependencies are expected and (at times) unavoidable.

## Contributing

Pull requests will not be accepted unless they adhere to the following:

- Adapters must follow the styles and naming conventions noted above in the README.
- If an adapter uses a documented API for the 3rd party tool - please leave a link to the documentation in a comment at the top of the adapter.
- Adapters should not require any 3rd party JS library with the exception of a library loaded by the embedded content the adapter is written for.
- Credit must be given to the original authors of any previously written code refactored for this repository. 
- No build tooling is to be used with the exception being the included template generators via `npm run generate`

Additionally, when submitting a pull request, please provide an example URL where this adapter can be tested.


---

## Adapters by Platform

### Calendly

#### Meetings
`adapters/Calendly/meeting.js`
### ChiliPiper

#### Meetings
`adapters/ChiliPiper/meeting.js`
### HubSpot

#### Forms 
`adapters/HubSpot/form.js`

#### Meetings 
`adapters/HubSpot/meeting.js`

#### Video 
`adapters/HubSpot/video.js`

#### Live Chat & Chatbots 
`adapters/HubSpot/chat.js`

### Marketo

#### Forms (coming soon)

### Typeform

#### Forms (coming soon)

### Vidyard
#### Videos (Coming Soon)
### Vimeo
#### Videos
`adapters/Vimeo/video.js`
### Wistia
#### Videos (Coming Soon)
### YouTube
GTM offers a native YouTube trigger that should be utilized for tracking engagement with embedded YouTube videos. No special adapter should be necessary.

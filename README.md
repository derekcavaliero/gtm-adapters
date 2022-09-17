# Google Tag Manager (GTM) Adapters for Embedded Content
This is a repository that contains adapters for sending interaction data to the GTM dataLayer for various types of embedded content such as: Live Chat, Video, Forms etc...

**Please note, these adapaters are meant to be abstract.** They are built to send raw data into the dataLayer for use inside various tags and triggers via variables. The adapters are written in a way that should allow easy customization of the dataLayer payload sent with the event. 

As such, the adapters in this repository will __never__ be configured to send data directly to a certain adtech/martech platform.

## Styles & Conventions
**These are style preferences for the sake of maintaining this repository.** The adapters should be easy enough to configure to your own personal implementation needs.

### dataLayer Global
It is assumed that the website/appication is using the default `window.dataLayer` global. Changing the default dataLayer global variable is uncommon. However, if the dataLayer *has* been customized, the adapters will not work without modifying the dataLayer reference in each script. 
### dataLayer Event Names

Event names are *typically* in the following format:

`{{namespace}}.{{object}}_{{action}}`

The **`{{object}}_{{action}}`** portion of the event name is always formatted in `snake_case`.

**`{{namespace}}`** is *typically* the lowercase name of the platform the adapter is written for (e.g. `hubspot`). This value is usually stored in a `namespace` variable for easy customization if desired.

**`{{object}}`** is typically a static value prefix for what kind of embedded object the event is describing (e.g. `form` or `chat`).

**`{{action}}`** is a highly variable value that describes the action taking place (e.g. `submit` or `start`, `complete`). These values are usually derrived from the events emitted from the embedded content via a mapping inside the adapter.

#### Exceptions
Certain kinds of adapters may choose to push data to GTM in a format that is used by built-in triggers and variables (this is fairly common with video adapters). This often times is done to simplify the use of the data without needing to create excess variables and triggers. 

## How to Use
Each adapter in this repository should be a stand-alone file ready for use inside a Custom HTML tag. Most of these adapters will load once per-page using an All Pages (or similar) trigger type. Adapters with specific implementation requirements or caveats will include implementation notes at the top of the file.

It is not required to implement these adapters with GTM. They can be included as part of a website/applications main script files if desired. 

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
- Adapters should not require any 3rd party JS library with the exception of a library loaded by the embdded content the adapter is written for.
- Credit must be given to the original authors of any previously written code  refactored for this repository. 
- No build tooling is to be used. These code snippets are meant to be dropped directly into GTM and as such should not be minified or use unsupported JS syntax.


---

## Adapters
### Forms

#### HubSpot

#### Marketo

### Chat & Chatbots

#### HubSpot

#### Drift

#### LiveChat

#### Terminus

### Meetings

#### HubSpot

#### Calendly

#### ChiliPiper

### Video

#### HubSpot

#### JW Player

#### Vidyard

#### Vimeo

#### Wistia

#### YouTube
GTM offers a native YouTube trigger that should be utilized for tracking engagement with embedded YouTube videos.

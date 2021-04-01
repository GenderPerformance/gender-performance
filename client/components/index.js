/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {default as Analysis} from './Analysis'
export {default as Recorder} from './Recorder'
export {default as UserHistory} from './UserHistory'
export {default as About} from './About'
export {Login, Signup} from './auth-form'

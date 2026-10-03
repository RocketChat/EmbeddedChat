import { createContext } from 'react';

/**
 * Carries the term that produced the current search results.
 * Only the search view provides it, so message rendering everywhere else
 * keeps its existing behaviour.
 */
const SearchHighlightContext = createContext('');

export default SearchHighlightContext;

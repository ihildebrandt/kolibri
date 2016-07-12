const Resources = require('kolibri').resources.ContentNodeResource;
const constants = require('./state/constants');

const PageNames = constants.PageNames;

function _crumbState(ancestors) {
  // skip the root node
  return ancestors.slice(1).map(ancestor => ({
    id: ancestor.pk,
    title: ancestor.title,
  }));
}

function _topicState(data) {
  const state = {
    id: data.pk,
    title: data.title,
    description: data.description,
    breadcrumbs: _crumbState(data.ancestors),
  };
  return state;
}

function _contentState(data) {
  const state = {
    id: data.pk,
    title: data.title,
    kind: data.kind,
    description: data.description,
    thumbnail: data.thumbnail,
    available: data.available,
    files: data.files,
    progress: data.progress ? data.progress : 'unstarted',
    breadcrumbs: _crumbState(data.ancestors),
  };
  return state;
}

function showExploreTopic(store, id) {
  store.dispatch('SET_LOADING');
  store.dispatch('SET_PAGE_NAME', PageNames.EXPLORE_ROOT);

  const attributesPromise = Resources.getModel(id).fetch();
  const childrenPromise = Resources.getCollection({ parent: id }).fetch();

  Promise.all([attributesPromise, childrenPromise])
    .then(([attributes, children]) => {
      const pageState = { id };
      pageState.topic = _topicState(attributes);
      pageState.subtopics = children
        .filter((item) => item.kind === 'topic')
        .map((item) => _topicState(item));
      pageState.contents = children
        .filter((item) => item.kind !== 'topic')
        .map((item) => _contentState(item));
      store.dispatch('SET_PAGE_STATE', pageState);
    })
    .catch((error) => {
      // TODO - how to parse and format?
      store.dispatch('SET_PAGE_ERROR', JSON.stringify(error, null, '\t'));
    });
}

function showExploreContent(store, id) {
  store.dispatch('SET_LOADING');
  store.dispatch('SET_PAGE_NAME', PageNames.EXPLORE_CONTENT);

  Resources.getModel(id).fetch()
    .then((attributes) => {
      const pageState = _contentState(attributes);
      store.dispatch('SET_PAGE_STATE', pageState);
    })
    .catch((error) => {
      // TODO - how to parse and format?
      store.dispatch('SET_PAGE_ERROR', JSON.stringify(error, null, '\t'));
    });
}

function showLearnRoot(store) {
  store.dispatch('SET_PAGE_NAME', PageNames.LEARN_ROOT);
  store.dispatch('SET_PAGE_STATE', {}); // TODO
}

function showScratchpad(store) {
  store.dispatch('SET_PAGE_NAME', PageNames.SCRATCHPAD);
  store.dispatch('SET_PAGE_STATE', {});
}

function showSearchResults(store, params, page) {
  store.dispatch('SET_SEARCH_LOADING', true);

  const pageSize = 15;
  const contentCollection = Resources.getPagedCollection({
    search: params,
  }, {
    pageSize,
    page,
  });
  const searchResultsPromise = contentCollection.fetch();

  searchResultsPromise.then((results) => {
    const searchState = { params };
    searchState.pageCount = contentCollection.pageCount;
    searchState.topics = results
      .filter((item) => item.kind === 'topic')
      .map((item) => _topicState(item));
    searchState.contents = results
      .filter((item) => item.kind !== 'topic')
      .map((item) => _contentState(item));
    store.dispatch('SET_SEARCH_STATE', searchState);
    store.dispatch('SET_SEARCH_LOADING', false);
  })
  .catch((error) => {
    // TODO - how to parse and format?
    store.dispatch('SET_SEARCH_ERROR', JSON.stringify(error, null, '\t'));
  });
}

const searchReset = ({ dispatch }) => {
  dispatch('SET_SEARCH_LOADING', false);
};

module.exports = {
  showExploreTopic,
  showExploreContent,
  showLearnRoot,
  showScratchpad,
  showSearchResults,
  searchReset,
};
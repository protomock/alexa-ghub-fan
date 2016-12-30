require('dependency-binder')({
    'SpaceConverter': require('./SpaceConverter')
});

var spaceConverter = binder.resolve('SpaceConverter');

module.exports = {
    provideCreateRepositorySlots: function(intent) {
        var repositoryNameSlot = intent.slots.RepositoryName;
        if (!repositoryNameSlot || !repositoryNameSlot.value) {
            intent.slots.error = true;
        }
        return intent.slots;
    },
    provideLatestCommitSlots: function(intent) {
        var repositoryNameSlot = intent.slots.RepositoryName;
        if (!repositoryNameSlot || !repositoryNameSlot.value) {
            repositoryNameSlot.error = true;
        } else {
            repositoryNameSlot.value = spaceConverter.convertSpacesToDashes(repositoryNameSlot.value);
        }
        return repositoryNameSlot;
    }
}

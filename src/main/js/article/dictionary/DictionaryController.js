export default class DictionaryController {

    /*@ngInject*/
    constructor($rootScope, $scope, articleService, $mdDialog, $mdToast) {

        this.$rootScope = $rootScope;
        this.articleService = articleService;
        this.$mdDialog = $mdDialog;
        this.$mdToast = $mdToast;

        this.articles = this.articleService.getAllArticles();

        this._init();
        this._initDestroyListener($scope);
    }

    dictionaryIsEmpty() {
        return !this.articles || !this.articles.length || this.articles.length == 0;
    }

    clearDictionary(ev) {

        const lengthBefore = this.articles.length;

        const confirm = this.$mdDialog.confirm()
            .title('Möchtest du dein Wörterbuch wirklich leeren?')
            .content('Alle ungenutzten Einträge werden unwideruflich gelöscht.')
            .targetEvent(ev)
            .ok('Ja')
            .cancel('Nein');

        return this.$mdDialog.show(confirm)
            .then(() => {
                this.$rootScope.loading = true;
                return this.articleService.deleteUnusedArticles();
            }).then(() => {
                if (lengthBefore != this.articles.length) {
                    this.$mdToast.show(
                        this.$mdToast.simple()
                            .content('Ungenutzte Einträge gelöscht')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                } else {
                    this.$mdToast.show(
                        this.$mdToast.simple()
                            .content('Alle Einträge sind in Verwendung')
                            .position('bottom right')
                            .hideDelay(3000)
                    );
                }
            }).catch(() => {
                this.$rootScope.loading = false;
            });
    }

    _initDestroyListener($scope) {

        $scope.$on('$destroy', () => this.$rootScope.reset());
    }

    _init() {

        this.$rootScope.title = 'Wörterbuch';
        this.$rootScope.options = [
            {
                icon: '/img/icons/communication/ic_clear_all_24px.svg',
                text: 'Wörterbuch leeren',
                action: () => this.clearDictionary(),
                disabled: () => this.dictionaryIsEmpty()
            }
        ];
    }
}
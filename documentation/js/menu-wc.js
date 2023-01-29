'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ba documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' : 'data-target="#xs-controllers-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' :
                                            'id="xs-controllers-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ClusterMetricsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClusterMetricsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DeploymentInformationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeploymentInformationController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/DerivativeController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DerivativeController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EventSetController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventSetController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/EventsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/HpaController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HpaController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PodMetricsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PodMetricsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/PrometheusMetricsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrometheusMetricsController</a>
                                            </li>
                                            <li class="link">
                                                <a href="controllers/ScalingConditionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScalingConditionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' : 'data-target="#xs-injectables-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' :
                                        'id="xs-injectables-links-module-AppModule-206a51e12bc6f97a469e420ff373f66935fcd4cfae1205090a7035689ea37e9c2586d516fac17788174dcb62d7beee57b0da056c633196ff37ae13e67a5a1702"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ClusterMetricsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ClusterMetricsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DeploymentInformationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DeploymentInformationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/DerivativeService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DerivativeService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventSetService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventSetService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EventsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EventsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/HpaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HpaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PodMetricsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PodMetricsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrometheusMetricsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrometheusMetricsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ScalingConditionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScalingConditionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ClusterMetricsController.html" data-type="entity-link" >ClusterMetricsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DeploymentInformationController.html" data-type="entity-link" >DeploymentInformationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/DerivativeController.html" data-type="entity-link" >DerivativeController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EventsController.html" data-type="entity-link" >EventsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EventSetController.html" data-type="entity-link" >EventSetController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HpaController.html" data-type="entity-link" >HpaController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PodMetricsController.html" data-type="entity-link" >PodMetricsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PrometheusMetricsController.html" data-type="entity-link" >PrometheusMetricsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ScalingConditionsController.html" data-type="entity-link" >ScalingConditionsController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/ClusterMetric.html" data-type="entity-link" >ClusterMetric</a>
                            </li>
                            <li class="link">
                                <a href="classes/Condition.html" data-type="entity-link" >Condition</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContainerInformation.html" data-type="entity-link" >ContainerInformation</a>
                            </li>
                            <li class="link">
                                <a href="classes/CrudFilters.html" data-type="entity-link" >CrudFilters</a>
                            </li>
                            <li class="link">
                                <a href="classes/CrudSorting.html" data-type="entity-link" >CrudSorting</a>
                            </li>
                            <li class="link">
                                <a href="classes/DeploymentInformation.html" data-type="entity-link" >DeploymentInformation</a>
                            </li>
                            <li class="link">
                                <a href="classes/Event.html" data-type="entity-link" >Event</a>
                            </li>
                            <li class="link">
                                <a href="classes/EventDto.html" data-type="entity-link" >EventDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Hpa.html" data-type="entity-link" >Hpa</a>
                            </li>
                            <li class="link">
                                <a href="classes/ListQueryDto.html" data-type="entity-link" >ListQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Metric.html" data-type="entity-link" >Metric</a>
                            </li>
                            <li class="link">
                                <a href="classes/Pagination.html" data-type="entity-link" >Pagination</a>
                            </li>
                            <li class="link">
                                <a href="classes/PodInformation.html" data-type="entity-link" >PodInformation</a>
                            </li>
                            <li class="link">
                                <a href="classes/PrometheusMetric.html" data-type="entity-link" >PrometheusMetric</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryDto.html" data-type="entity-link" >QueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ScalingCondition.html" data-type="entity-link" >ScalingCondition</a>
                            </li>
                            <li class="link">
                                <a href="classes/Set.html" data-type="entity-link" >Set</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClusterMetricsService.html" data-type="entity-link" >ClusterMetricsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DeploymentInformationService.html" data-type="entity-link" >DeploymentInformationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DerivativeService.html" data-type="entity-link" >DerivativeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventSetService.html" data-type="entity-link" >EventSetService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventsService.html" data-type="entity-link" >EventsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HpaService.html" data-type="entity-link" >HpaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PodMetricsService.html" data-type="entity-link" >PodMetricsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrometheusMetricsService.html" data-type="entity-link" >PrometheusMetricsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScalingConditionsService.html" data-type="entity-link" >ScalingConditionsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Data.html" data-type="entity-link" >Data</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Metric.html" data-type="entity-link" >Metric</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Result.html" data-type="entity-link" >Result</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ResultDto.html" data-type="entity-link" >ResultDto</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ToNumberOptions.html" data-type="entity-link" >ToNumberOptions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
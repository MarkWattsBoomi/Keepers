import { eLoadingState, FlowComponent } from 'flow-component-model';
import React from 'react';


//declare const manywho: IManywho;
declare const manywho: any;

export default class TabKeeper extends FlowComponent {
    version: string="1.0.0";
    context: any;
    tabsElement: Element;
    count: number = 0;
    selectedTab: string;
       

    constructor(props: any) {
        super(props);
        this.flowMoved = this.flowMoved.bind(this);
        this.flowWillMove = this.flowWillMove.bind(this);
        this.setSelectedTab = this.setSelectedTab.bind(this);
        this.getSelectedTab = this.getSelectedTab.bind(this);
    }

    findParentTabs(element: any) : Element {
        let style = getComputedStyle(element);
        if(element.classList.contains("mw-group")) {
            return element;
        }
        else {
            element = element.parentElement;
            return this.findParentTabs(element);
        }
    }

    async flowWillMove(xhr: any, request: any) {
        
        this.selectedTab = this.getSelectedTab();
        sessionStorage.setItem(this.flowKey + "_" + this.componentId + "_tab",this.selectedTab);
    }

    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==="FORWARD") {
            if(this.loadingState !== eLoadingState.ready){
                window.setTimeout(function() {me.flowMoved(xhr, request)},500);
            }
            else {
                let parent: any = manywho.model.getContainer(this.parentId,this.flowKey);
                if(parent) {
                    let thisElement = document.getElementById(parent.id);
                    this.tabsElement = this.findParentTabs(thisElement);
                    this.selectedTab = sessionStorage.getItem(this.flowKey + "_" + this.componentId + "_tab"); 
                    window.setTimeout(this.setSelectedTab,100);
                }
            }
        }
        
    }

    async componentDidMount() {
        //will get this from a component attribute
        await super.componentDidMount();
        let parent: any = manywho.model.getContainer(this.parentId,this.flowKey);
        let thisElement = document.getElementById(parent.id);
        this.tabsElement = this.findParentTabs(thisElement);
        this.selectedTab = sessionStorage.getItem(this.flowKey + "_" + this.componentId + "_tab"); 
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        (manywho as any).eventManager.addBeforeSendListener(this.flowWillMove, this.componentId);
        //this.parentScroller.addEventListener("scroll", this.scrollMove, {passive: false});
        window.setTimeout(this.setSelectedTab,100);
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        
        (manywho as any).eventManager.removeDoneListener(this.componentId);
        (manywho as any).eventManager.removeBeforeSendListener(this.componentId);
    }

    setSelectedTab() {
        if(this.selectedTab && this.tabsElement) {
            for(let tabElementsPos = 0 ; tabElementsPos < this.tabsElement.children[0].children.length ; tabElementsPos++) {
                //2 children, 1 is tab label other is tab content - we want to look at tab content ones
                if(this.tabsElement.children[0].children[tabElementsPos].classList.contains("nav-tabs")) {
                    for(let tabPos = 0 ; tabPos < this.tabsElement.children[0].children[tabElementsPos].children.length ; tabPos ++) {
                        if(this.tabsElement.children[0].children[tabElementsPos].children[tabPos].children[0].id === this.selectedTab) {
                            let evObj = document.createEvent('Events');
                            evObj.initEvent('click', true, false);
                            this.tabsElement.children[0].children[tabElementsPos].children[tabPos].children[0].dispatchEvent(evObj);
                        }
                        else {
                            //this.tabsElement.children[0].children[tabElementsPos].children[tabPos].classList.remove("active");
                        }
                    }
                }
            }
        }
        
    }

    getSelectedTab() : string {
        let tabId: string;
        if(this.tabsElement) {
            for(let tabElementsPos = 0 ; tabElementsPos < this.tabsElement.children[0].children.length ; tabElementsPos++) {
                //2 children, 1 is tab label other is tab content - we want to look at tab content ones
                if(this.tabsElement.children[0].children[tabElementsPos].classList.contains("nav-tabs")) {
                    for(let tabPos = 0 ; tabPos < this.tabsElement.children[0].children[tabElementsPos].children.length ; tabPos ++) {
                        if(this.tabsElement.children[0].children[tabElementsPos].children[tabPos].classList.contains("active")) {
                            return this.tabsElement.children[0].children[tabElementsPos].children[tabPos].children[0].id;
                        }
                    }
                }
            }
        }
        return tabId;
    }

    render() {       
        return (<div></div>)
    }
}

manywho.component.register('TabKeeper', TabKeeper);
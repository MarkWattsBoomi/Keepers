import { eLoadingState, FlowComponent } from 'flow-component-model';
import React from 'react';


//declare const manywho: IManywho;
declare const manywho: any;

export default class ScrollKeeper extends FlowComponent {
    version: string="1.0.0";
    context: any;
    parentScroller: any;
    count: number = 0;
    scrollTop: number = 0;
    tScrollTop: number = 0;
    scrollLock: boolean = false;
       

    constructor(props: any) {
        super(props);
        this.scrollMove = this.scrollMove.bind(this);
        this.flowMoved = this.flowMoved.bind(this);
        this.flowWillMove = this.flowWillMove.bind(this);
        this.setScrollPos = this.setScrollPos.bind(this);
        delete manywho["component.scrollToTop"];
        manywho.component.scrollToTop = function(){};
        module.exports = manywho;
    }

    findParentScroller(element: any) : Element {
        let style = getComputedStyle(element);
        if(style.getPropertyValue("overflow-x")==="auto" || style.getPropertyValue("overflow-y")==="auto" || style.getPropertyValue("overflow")==="auto" || element.id==="manywho" || element.tagName==="body") {
            return element;
        }
        else {
            element = element.parentElement;
            return this.findParentScroller(element);
        }
    }

    scrollMove(e: any) {
        if(this.scrollLock === false) {
            this.scrollTop = this.parentScroller.scrollTop;
            sessionStorage.setItem(this.flowKey + "_" + this.componentId + "_y",this.scrollTop.toString());
            console.log(this.scrollTop);
            //console.log(window.pageYOffset);
        }
    }

    async flowWillMove(xhr: any, request: any) {
        this.scrollLock=true;
        this.tScrollTop = this.parentScroller.scrollTop;
        sessionStorage.setItem(this.flowKey + "_" + this.componentId + "_y",this.tScrollTop.toString());
    }

    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==="FORWARD") {
            if(this.loadingState !== eLoadingState.ready){
                window.setTimeout(function() {me.flowMoved(xhr, request)},500);
            }
            else {
                this.scrollLock = false;
                let parent: any = manywho.model.getContainer(this.parentId,this.flowKey);
                if(parent) {
                    let thisElement = document.getElementById(parent.id);
                    this.parentScroller = this.findParentScroller(thisElement);
                    this.scrollTop = parseFloat(sessionStorage.getItem(this.flowKey + "_" + this.componentId + "_y") || "0"); 
                    window.setTimeout(this.setScrollPos,100);
                }
            }
        }
        
    }

    async componentDidMount() {
        //will get this from a component attribute
        await super.componentDidMount();
        let parent: any = manywho.model.getContainer(this.parentId,this.flowKey);
        let thisElement = document.getElementById(parent.id);
        this.parentScroller = this.findParentScroller(thisElement);
        this.scrollTop = parseFloat(sessionStorage.getItem(this.flowKey + "_" + this.componentId + "_y") || "0"); 
        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        (manywho as any).eventManager.addBeforeSendListener(this.flowWillMove, this.componentId);
        //this.parentScroller.addEventListener("scroll", this.scrollMove, {passive: false});
        window.setTimeout(this.setScrollPos,100);
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        this.parentScroller.removeEventListener("scroll", this.scrollMove, {passive: true});
        (manywho as any).eventManager.removeDoneListener(this.componentId);
        (manywho as any).eventManager.removeBeforeSendListener(this.componentId);
    }

    setScrollPos(repeat: boolean = true) {
        let me = this;
        this.parentScroller.scrollTop = this.scrollTop;  
        if(repeat === true) {
            window.setTimeout(function(){me.setScrollPos(false)},300); 
        }
    }

    render() {       
        return (<div></div>)
    }

    


}

manywho.component.register('ScrollKeeper', ScrollKeeper);
declare function jQuery(selector:string):HTMLElement;
declare namespace jQuery{
    function ajax(url:string):void;
}
//export default jQuery;
export = jQuery; 
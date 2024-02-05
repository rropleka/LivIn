export default class Listing {
    PropertyName = null;
 
    constructor(propertyName) 
    {
      this.PropertyName = propertyName;
    }
    getPropertyName()
    {
      return this.PropertyName;
    }        
}
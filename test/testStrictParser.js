const src=function(filePath){return "../src/"+filePath};
const errors=function(filePath){return "../src/errors/"+filePath};

const assert=require('chai').assert;
const StrictParser=require(src('index.js')).StrictParser;
const InvalidKeyError=require(errors('invalidKeyError.js'));

var invalidKeyErrorChecker=function(key,pos,err) {
    if(err instanceof InvalidKeyError && err.invalidKey==key && err.position==pos)
      return true;
    return false;
}

describe("strict parser",function(){
  it("should only parse keys that are specified for a single key",function(){
    let kvParser=new StrictParser(["name"]);
      try{
        var p=kvParser.parse("age=23");
      }catch(err){
      assert.ok(invalidKeyErrorChecker("age",5,err))       
      }
  });

  it("should only parse keys that are specified for multiple keys",function(){
    let kvParser=new StrictParser(["name","age"]);
    let actual=kvParser.parse("name=john age=23");
    let expected={name:"john",age:"23"};
    assert.ownInclude(expected,actual);
      try{
        var p=kvParser.parse("color=blue");
      }catch(err){
      assert.ok(invalidKeyErrorChecker("color",9,err))
      }
  });

  it("should throw an error when one of the keys is not valid",function(){
    try{
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name=john color=blue age=23");
      }catch(err){
        invalidKeyErrorChecker("color",20,err)
      }
  });

  it("should throw an error on invalid key when there are spaces between keys and assignment operators",function(){
    try{
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = blue");
      }catch(err){
        invalidKeyErrorChecker("color",13,err)
      }
  });

  it("should throw an error on invalid key when there are quotes on values",function(){
    try{
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("color   = \"blue\"");
      }catch(err){
        invalidKeyErrorChecker("color",15,err)
      }
  });

  it("should throw an error on invalid key when there are cases of both quotes and no quotes",function(){
    try{
        let kvParser=new StrictParser(["name","age"]);
        kvParser.parse("name = john color   = \"light blue\"");
      }catch(err){
        invalidKeyErrorChecker("color",33,err)
      }
  });

  it("should throw an error when no valid keys are specified",function(){
    try{
        let kvParser=new StrictParser([]);
        kvParser.parse("name=john");
      }catch(err){
        invalidKeyErrorChecker("name",8,err)
      }
  });

  it("should throw an error when no array is passed",function(){
    try{
        let kvParser=new StrictParser();
        kvParser.parse("name=john");
      }catch(err){
        invalidKeyErrorChecker("name",8,err)
      }
  });

});

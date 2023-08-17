class Person{

    static data = {

    }
    static secrets = {

    }

    constructor(x,y,z){
        Person.data.kvs = [x,y];
        Person.secrets = {
            z: 3
        }
    }

    static init(x,y,z) {
        
        return new Person(x,y,z);

    }

}

let x = Person.init(1,2,4);
console.log(Person.data.kvs,Person.secrets);
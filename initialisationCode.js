var people = new Object(); //the collection of all people in the data, indexed by their associative IDs on IMDB
$(document).ready(function(){
	$.ajax({
		//access the JSON file on the server
		type: "GET",
		crossDomain: true,
		datatype: "jsonp",
		url: "http://dww.aesphere.net/dbDump.json",
		success: function(obj){
			//iterate over each element in the collection
			$.each(obj.data, function(index, value){
				var id = value[0].data.id;
				var name = value[0].data.name;
				var company = value[2].data.name; //more accurate company string match 
				var role = value[1].data.role;
				var release = value[1].data.release;
				//add entry to people dataset
				if(people[id] == undefined){
					//performed the first time the person arises (i.e. establishes variable)
					var person = new Object();
					person.name = name;
					person.company = new Array(company);
					person.role = new Array(role);
					person.release = new Array(release.toString());
					people[id] = person;
				}
				else{
					//performed subsequent time person arises (i.e. updates variable)
					var person = people[id];
					person.company[person.company.length] = company;
					person.role[person.role.length] = role;
					person.release[person.release.length] = release.toString();
				}
			});
			//Now we need to sort the data so that it appears in chronological order per person 
			for(var id in people){
				if(!people.hasOwnProperty(id)){continue;} //not a valid property in prototype chain 
				chronologicalSort(people[id]);
			}
		}
	});
});

/**
 * Sorts the company, role and release data inherent in the person object so that it is in chronological order.
 * This is achieved by reshuffling the release date array, and then by applying the same transformation
 * to the other company and release arrays. As array data corresponds by index, this function ensures that
 * none of the data becomes jumbled.  
 *  
 * @param person - the person who is to have their data sorted chronologically. 
 */
function chronologicalSort(person){
	var numCredits = person.release.length; //how many credits this person has to their name 
	if(numCredits != person.company.length || numCredits != person.role.length) throw new Exception(); //implies data inconsistency 
	var shuffleOrder = new Array(); //record of how we are going to order this array
	//iterate through all elements recording the earliest year each time and recording this year's index  
	var count = 0;
	while(count < numCredits){
		var minimumYear = Number.POSITIVE_INFINITY;
		for(var i=count; i<numCredits; i++){
			if(person.release[i] < minimumYear){ minimumYear = person.release[i]; }
		}
		var index = person.release.indexOf(minimumYear, count); 
		person.release = swap(person.release, count, index);
		//record swap in shuffleOrder
		shuffleOrder[shuffleOrder.length] = count;
		shuffleOrder[shuffleOrder.length] = index;
		//increment count
		count++;
	}
	//now that release dates have been successfully ordered, apply the same transformation to company and role 
	for(var i=0; i<shuffleOrder.length; i+=2){
		person.company = swap(person.company, shuffleOrder[i], shuffleOrder[i+1]);
		person.role = swap(person.role, shuffleOrder[i], shuffleOrder[i+1]);
	}
}

/**
 * Swaps two items in an array and returns the new array 
 * @param array
 * @param indexA
 * @param indexB
 */
function swap(array, indexA, indexB){
	var temp = array[indexA];
	array[indexA] = array[indexB];
	array[indexB] = temp;
	return array;
}


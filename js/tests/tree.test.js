define(['jquery', 'tree'], function( $, tree ) {
    module("Tree Tests");
    test("Test tree methods", function(){
	//expect(2);
	equal( 1, 1, "A trivial test");
	ok( true, "Another trivial test");


	//three different ways to initialize a node:
	
	//1: pass in a name
	var node = new tree('test_node');
	equal(node.name, 'test_node');

	//2: make a blank node, then assign attributes later
	var node = new tree();
	equal(node.name, '');
	node.name = 'test_node';
	equal(node.name, 'test_node');

	//3: pass in an object
	var node = new tree({'name':'test_node'});
	equal(node.name, 'test_node');

	//console.log(JSON.stringify(node));

	//4: test the details
	var node = new tree({"name":"test_node","id":".ignore_this","content":"test_content","children":[],"parent":""} );
	equal(node.name, 'test_node');
	equal(node.id(), '.test_node');
	equal(node.content, 'test_content');
	equal(node.parent, '');

	//5: test children
	//{"name":"root","content":"root_node","children":[{"name":"child1","content":"child1_node","children":[]}, {"name":"child2","content":"child2_node","children":[]}, {"name":"child3","content":"child3_node","children":[]} ]} 
	var node = new tree({"name":"root","content":"root_node","children":[{"name":"child1","content":"child1_node","children":[]}, {"name":"child2","content":"child2_node","children":[]}, {"name":"child3","content":"child3_node","children":[]} ]} );

	equal(node.name, 'root');
	equal(node.content, 'root_node');
	equal(node.children.length, 3);
	var child2 = node.children[1];
	node.remove(child2);
	equal(node.children.length, 2);
	equal(node.children[1].name, 'child3');

	//console.log(node.to_json());
	var custom = JSON.parse('{"name":"root","content":"root_node","children":[{"name":"child1","content":"child1_node","children":[]},{"name":"child3","content":"child3_node","children":[]}]}');
	//console.log(custom);
	equal(JSON.stringify(custom), node.to_json());

	node.to_dom($('body'));

	//test neighbors:
	//console.log(node.neighbors());
	equal(node.neighbors().length, 0);
	equal(node.children[0].neighbors().length, 1);

	var neighbors = node.children[0].neighbors();
	//for (var i = 0; i < neighbors.length; i++) {
	//    console.log(neighbors[i].name);
	//};
	equal(neighbors[0].name, "child3");

	//test root
	equal(node, node.root());
	equal(node.children[0].root(), node);

	var blah = $('#root');
	console.log(blah);

    });
});

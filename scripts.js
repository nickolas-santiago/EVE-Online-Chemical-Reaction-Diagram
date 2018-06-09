"use strict";
var total_window_width = 1280;
var total_diagram_height = 900;
var element_column_xpos = ((total_window_width/5) + ((total_window_width/5) * 1) - 15);
var unrefined_reaction_column_xpos = ((total_window_width/5) + ((total_window_width/5) * 0) - 40);
var simple_reaction_column_xpos = ((total_window_width/5) + ((total_window_width/5) * 2) + 15);
var complex_reaction_column_xpos = ((total_window_width/5) + ((total_window_width/5) * 3) + 40);
    
d3.json("reactionData.json", function(myData)
{
    console.log(myData.reactions);
    //---First step: set up the data
    var global_element_list = [];
    var global_simple_reaction_list = [];
    var global_complex_reaction_list = [];
    var global_unrefined_reaction_list = [];
    var temp_element_list = [];
    for(var sr = 0; sr < myData.reactions.simple_reactions.length; sr++)
    {
        global_simple_reaction_list.push(myData.reactions.simple_reactions[sr].reaction_name);
        for(var element = 0; element < myData.reactions.simple_reactions[sr].reaction_input.length; element++)
        {
            temp_element_list.push(myData.reactions.simple_reactions[sr].reaction_input[element]);
        }
    }
    for(var cr = 0; cr < myData.reactions.complex_reactions.length; cr++)
    {
        global_complex_reaction_list.push(myData.reactions.complex_reactions[cr].reaction_name);
    }
    for(var ur = 0; ur < myData.reactions.unrefined_reactions.length; ur++)
    {
        global_unrefined_reaction_list.push(myData.reactions.unrefined_reactions[ur].reaction_name);
    }
    global_element_list = temp_element_list.filter(function(value, index, self)
    {
        return self.indexOf(value) === index;
    });
    var text_height = 15;
    var diagram = d3.select("#diagram").append("svg")
        .attr("width", total_window_width)
        .attr("height", total_diagram_height + "px")
        .attr("id", "diagram_svg");
    renderColumns(diagram, "elementsList", global_element_list, element_column_xpos, text_height, "elements", "element_", "Elements");
    renderColumns(diagram, "unrefinedReactionsList", global_unrefined_reaction_list, unrefined_reaction_column_xpos, text_height, "unrefined_reactions", "unrefined_reaction_", "Unrefined Reactions");
    renderColumns(diagram, "simpleReactionsList", global_simple_reaction_list, simple_reaction_column_xpos, text_height, "simple_reactions", "simple_reaction_", "Simple Reactions");
    renderColumns(diagram, "complexReactionssList", global_complex_reaction_list, complex_reaction_column_xpos, text_height, "complex_reactions", "complex_reaction_", "Complex Reactions");
    
    $(".option").on("mouseover", function()
    {
        var reaction_list = [];
        var list_of_lines = [];
        
        //---first check if the user's selection exists as as an inout to a reaction
        //   if so, add the output reaction to reaction_list
        for(var key in myData.reactions)
        {
            if(myData.reactions.hasOwnProperty(key))
            {
                for(var a_reaction = 0; a_reaction < myData.reactions[key].length; a_reaction++)
                {
                    if(myData.reactions[key][a_reaction].reaction_name == $(this)["0"].textContent)
                    {
                        reaction_list.push(myData.reactions[key][a_reaction]);
                    }
                    else
                    {
                        for(var a_reaction_input_value = 0; a_reaction_input_value < myData.reactions[key][a_reaction].reaction_input.length; a_reaction_input_value++)
                        {
                            if(myData.reactions[key][a_reaction].reaction_input[a_reaction_input_value] == $(this)["0"].textContent)
                            {
                                reaction_list.push(myData.reactions[key][a_reaction]);
                            }
                        }
                    }
                }
            }
        }
        
        checkReactionsAsInputs(myData, reaction_list);
        checkInputsAsReactions(myData, reaction_list);
        
        var final_reaction_list = [];
        $.each(reaction_list, function(i, n){
            if($.inArray(n, final_reaction_list) === -1) final_reaction_list.push(n);
        });
        
        
        for(var reaction = 0; reaction < final_reaction_list.length; reaction++)
        {
            //---find a reaction's x,y location on the chart
            for(var key in myData.reactions)
            {
                if(myData.reactions.hasOwnProperty(key))
                {
                    for(var a_reaction = 0; a_reaction < myData.reactions[key].length; a_reaction++)
                    {
                        if(myData.reactions[key][a_reaction].reaction_name == final_reaction_list[reaction].reaction_name)
                        {
                            for(var a_reaction_input_value = 0; a_reaction_input_value < myData.reactions[key][a_reaction].reaction_input.length; a_reaction_input_value++)
                            {
                                var a_line_path = [];
                                $(".option").each(function()
                                {
                                    if($(this)["0"].textContent == myData.reactions[key][a_reaction].reaction_input[a_reaction_input_value])
                                    {
                                        if(key == "unrefined_reactions")
                                        {
                                            var path_endpoint = {
                                                x: ($(this)["0"].getBBox().x - 3),
                                                y: ($(this)["0"].getBBox().y + ($(this)["0"].getBBox().height/2))
                                            };
                                        }
                                        else
                                        {
                                            var path_endpoint = {
                                                x: ($(this)["0"].getBBox().x + $(this)["0"].getBBox().width + 3),
                                                y: ($(this)["0"].getBBox().y + ($(this)["0"].getBBox().height/2))
                                            };
                                        }
                                        a_line_path.push(path_endpoint);
                                    }
                                });
                                $(".option").each(function()
                                {
                                    if($(this)["0"].textContent == final_reaction_list[reaction].reaction_name)
                                    {
                                        if(key == "unrefined_reactions")
                                        {
                                            var path_endpoint = {
                                                x: ($(this)["0"].getBBox().x + $(this)["0"].getBBox().width + 3),
                                                y: ($(this)["0"].getBBox().y + ($(this)["0"].getBBox().height/2))
                                            };
                                        }
                                        else
                                        {
                                            var path_endpoint = {
                                                x: ($(this)["0"].getBBox().x - 3),
                                                y: ($(this)["0"].getBBox().y + ($(this)["0"].getBBox().height/2))
                                            };
                                        }
                                        a_line_path.push(path_endpoint);
                                    }
                                });
                                list_of_lines.push(a_line_path);
                            }
                        }
                    }
                }
            }
            if(final_reaction_list[reaction].reaction_output)
            {
                $(".option").each(function()
                {
                    if($(this)["0"].textContent == final_reaction_list[reaction].reaction_name)
                    {
                        var reaction_output = diagram.append("text")
                            .attr("x", ($(this)["0"].getBBox().x + $(this)["0"].getBBox().width/2))
                            .attr("y", ($(this)["0"].getBBox().y + ($(this)["0"].getBBox().height * 1.5)))
                            .text("+ " + final_reaction_list[reaction].reaction_output)
                            .attr("font-family", "sans-serif")
                            .attr("font-size", "13.5px")
                            .attr("fill", "red")
                            .attr("text-anchor", "middle")
                            .attr("font-family", "sans-serif")
                            .attr("fill", "#FF992D")
                            .attr("class", "reaction_output");
                    }
                });
            }
        }
        
        for(var a_line = 0; a_line < list_of_lines.length; a_line++)
        {
            var line = diagram.append("line")
                .attr("x1", list_of_lines[a_line][0].x)
                .attr("y1", list_of_lines[a_line][0].y)
                .attr("x2", list_of_lines[a_line][1].x)
                .attr("y2", list_of_lines[a_line][1].y)
                .attr("stroke-width", 1)
                .attr("stroke", function()
                    {
                        if(this.x2.baseVal.value < element_column_xpos)
                        {
                            return "#FF992D";
                        }
                        else if(this.x2.baseVal.value < simple_reaction_column_xpos)
                        {
                            return "#FFF95E";
                        }
                        else
                        {
                            return "#D95EFF";
                        }
                    })
                .attr("fill", "none");
        }
    });
    
    $(".option").on("mouseout", function()
    {
        d3.selectAll("line").remove();
        d3.selectAll($(".reaction_output")).remove();
    });
});
function renderColumns(loc, selector, data_set, xpos, text_size, reaction_class, id_name, label)
{
    var column_title = loc.append("text")
        .attr("x", xpos)
        .attr("y", 30)
        .text(label)
        .attr("font-family", "sans-serif")
        .attr("fill", "red")
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", (text_size + 4) + "px")
        .attr("font-weight", "bold")
        .attr("fill", "#F2F2F2")
        .attr("text-decoration", "underline");
    loc.selectAll(selector)
        .data(data_set)
        .enter()
        .append("text")
        .text(function(d,i)
        {
            return data_set[i];
        })
        .attr("x", xpos)
        .attr("y", function(d,i)
        {
		    //return (30 + (40 * (i + 0.7)));
            return (60 + ((total_diagram_height-100)/data_set.length * i));
        })
		.attr("text-anchor", "middle")
		.attr("font-family", "sans-serif")
		.attr("font-size", text_size + "px")
		.attr("font-weight", "bold")
		.attr("fill", "#D9D9E0")
        .attr("class", "option")
        .attr("id", function(d,i)
        {
            return id_name + i;
        });
}
function checkReactionsAsInputs(myData, reaction_list)
{
    //---check if each reaction so far is also an input to any other reactions.
    var list_clone = reaction_list.slice();
    for(var list_clone_item = 0; list_clone_item < list_clone.length; list_clone_item++)
    {
        for(var key in myData.reactions)
        {
            if(myData.reactions.hasOwnProperty(key))
            {
                for(var a_reaction = 0; a_reaction < myData.reactions[key].length; a_reaction++)
                {
                    for(var a_reaction_input_value = 0; a_reaction_input_value < myData.reactions[key][a_reaction].reaction_input.length; a_reaction_input_value++)
                    {
                        if(myData.reactions[key][a_reaction].reaction_input[a_reaction_input_value] == list_clone[list_clone_item].reaction_name)
                        {
                            reaction_list.push(myData.reactions[key][a_reaction]);
                        }
                    }
                }
            }
        }
    }
}
function checkInputsAsReactions(myData, reaction_list)
{
    var list_clone = reaction_list.slice();
    for(var list_clone_item = 0; list_clone_item < list_clone.length; list_clone_item++)
    {
        for(var list_clone_item_input_value = 0; list_clone_item_input_value < list_clone[list_clone_item].reaction_input.length; list_clone_item_input_value++)
        {
            for(var key in myData.reactions)
            {
                if(myData.reactions.hasOwnProperty(key))
                {
                    for(var a_reaction = 0; a_reaction < myData.reactions[key].length; a_reaction++)
                    {
                        if(myData.reactions[key][a_reaction].reaction_name == list_clone[list_clone_item].reaction_input[list_clone_item_input_value])
                        {
                            reaction_list.push(myData.reactions[key][a_reaction]);
                        }
                    }
                }
            }
        }
    }
}
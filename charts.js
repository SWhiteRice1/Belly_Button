function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
  
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu = result.otu_ids;
    var labels=result.otu_labels;
    var samples_values= result.sample_values;
    
    console.log(otu);
    console.log(labels);
    console.log(samples_values);
    
  // Build variables to hold wfreq
    var metadata = data.metadata;
    var metaArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var metadata_result = (metaArray[0]);
    console.log(metadata_result);
    var washFrq = metadata_result.wfreq;
    console.log(washFrq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu.slice(0,10).map(id => 'otu: ' + id).reverse();
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace ={
      x: samples_values.slice(0,10).reverse(),
      text: labels.slice(0,10).reverse(),
      name: "Belly Button Data",
      type: "bar",
      orientation: 'h'
    }
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"Top 10 Bacteria Cultures Found",
      yaxis: {
        tickmode: "array",
        tickvals: [0,1,2,3,4,5,6,7,8,9],
        ticktext: yticks
      },
      margin: {l: 100,
        r: 100,
        t: 100,
        b: 100}
     
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar",barData,barLayout)


// Bar and Bubble charts

    var trace1 ={
      x: otu,
      y: samples_values,
      text: labels,
      mode: 'markers',
      marker: {
        size: samples_values,
        color: otu,
        colorscale:'YlGnBu',
      }
    };
    // 1. Create the trace for the bubble chart.
    var bubbleData = [trace1];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      xaxis: {title: 'OTU ID', automargin: true},
      hovermode: "closest",
      height: 600,
      width: 600
    };
    console.log(bubbleData, bubbleLayout);
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData, bubbleLayout,{responsive: true}); 

 // 4. Create the trace for the gauge chart.
 var trace2 = {
  domain: { x: [0, 1], y: [0, 1] },
  value: washFrq,
  title: {text:'Wash Frequency'},
  type: 'indicator',
  mode: "gauge + number",
  gauge: { 
   type: 'pie',
   shape: "angular",
  'bar':{'color':'black'},
  'axis': {
      'range': [0, 10],
      'tickmode': 'array',
      'tickvals': [0,2,4,6,8,10],
      'ticktext': [0,2,4,6,8,10]
    },
    steps: [
      { 'range': [0, 2], 'color': "floralwhite" },
      { 'range': [2,4], 'color': "lemonchiffon" },
      { 'range': [4,6], 'color': "gold" },
      { 'range': [6,8], 'color': "goldenrod" },
      { 'range': [8,10], 'color': "darkgoldenron" }
    ],
 }
};
  var gaugeData = [trace2];

// 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
  width: 600, height: 450, margin: { t: 0, b: 0 } 
  };

// 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout, {responsive: true});
  });
}
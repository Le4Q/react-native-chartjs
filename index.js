import React, { Component } from "react";
import { WebView, Platform } from "react-native";
import PropTypes from "prop-types";
/**
 * initial script
 * @type {[string]}
 */
var settingChartScript = `
	Chart.defaults.global.defaultFontSize={DEFAULT_FONT_SIZE};
	var body = document.body;
	body.parentNode.removeChild(body);
	
	var bodyEl = document.createElement("body");
	bodyEl.setAttribute("id", "body");
	bodyEl.setAttribute("style", "height: 92%");
	document.getElementsByTagName("html")[0].appendChild(bodyEl);
	
	var canvasEl = document.createElement("canvas");
	canvasEl.setAttribute("id", "myChart");
	document.getElementById("body").appendChild(canvasEl);
	
	var ctx = document.getElementById("myChart").getContext('2d');
	var mychart = new Chart(ctx, {CONFIG});
`;

export default class Chart extends Component {
  static propTypes = {
    /**
     * props
     * @type {[object]}
     */
    chartConfiguration: PropTypes.object.isRequired,
    defaultFontSize: PropTypes.number,
    height: PropTypes.string,
    width: PropTypes.string,
  };
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.chartConfiguration !== this.props.chartConfiguration ||
      nextProps.defaultFontSize !== this.props.defaultFontSize
    ) {
      this.setChart(nextProps.chartConfiguration, nextProps.defaultFontSize);
    }
  }
  setChart(chartConfiguration, defaultFontSize) {
    if (
      !chartConfiguration ||
      undefined == defaultFontSize ||
      null == defaultFontSize
    ) {
      return;
    }
    this.webview &&
      this.webview.injectJavaScript(
        settingChartScript
          .replace("{CONFIG}", JSON.stringify(chartConfiguration))
          .replace("{DEFAULT_FONT_SIZE}", defaultFontSize)
      );
  }

  render() {
    const defaultFontSize = this.props.defaultFontSize
      ? this.props.defaultFontSize
      : 12;
    return (
      <WebView
        originWhitelist={["*"]}
        style={{ flex: 1 }}
        ref={ref => (this.webview = ref)}
        injectedJavaScript={settingChartScript
          .replace("{CONFIG}", JSON.stringify(this.props.chartConfiguration))
          .replace("{DEFAULT_FONT_SIZE}", defaultFontSize)}
        source={require("./dist/index.html")}
        onError={error => {
          console.log(error);
        }}
        renderError={e => {
          //Renders this view while resolving the error
          return (
            <View>
              <Text> {e} </Text>
              <Text>
                {" "}
                Restart the App if the error persists or try again later.{" "}
              </Text>
              <ActivityIndicator
                animating={true}
                color="#94C11F"
                size="large"
                hidesWhenStopped={true}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 30,
                  flex: 1,
                }}
              />
            </View>
          );
        }}
        // scalesPageToFit false for IOS and true for Android
        scalesPageToFit={Platform.OS === "ios" ? false : true}
        bounces={false}
        style={this.props.style}
      />
    );
  }
}

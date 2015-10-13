
// Create scope
"use strict";

var habitWidget = (function () {
	var LatestHabit = React.createClass({
		displayName: "LatestHabit",

		render: function render() {
			return React.createElement(
				"div",
				{ className: "habit-list" },
				"Latest task completed:",
				React.createElement(
					"div",
					{ className: "habit" },
					React.createElement(
						"span",
						{ className: "name" },
						this.props.text
					)
				)
			);
		}
	});

	var LevelIndicator = React.createClass({
		displayName: "LevelIndicator",

		render: function render() {
			return React.createElement(
				"span",
				{ className: "level" },
				"Lvl ",
				this.props.level
			);
		}
	});

	var ProfileName = React.createClass({
		displayName: "ProfileName",

		render: function render() {
			return React.createElement(
				"span",
				{ className: "profile-name" },
				this.props.name
			);
		}
	});

	var GlyphLabel = React.createClass({
		displayName: "GlyphLabel",

		render: function render() {
			var glyphs = {
				"hp": "fa fa-heart",
				"exp": "fa fa-star",
				"mp": "fa fa-fire"
			};
			var thisGlyph = glyphs[this.props.type];
			return React.createElement(
				"div",
				{ className: "glyph-label" },
				React.createElement("i", { className: thisGlyph })
			);
		}
	});

	var StatBar = React.createClass({
		displayName: "StatBar",

		render: function render() {
			var style = { width: Math.floor(this.props.statValue / this.props.max * 100) + "%" };
			var classes = "meter " + this.props.name;
			return React.createElement(
				"div",
				null,
				React.createElement(GlyphLabel, { type: this.props.name }),
				React.createElement(
					"div",
					{ className: "stat-bar" },
					React.createElement("div", { className: classes, style: style }),
					React.createElement(
						"span",
						{ className: "text" },
						this.props.statValue.toFixed(),
						" / ",
						this.props.max
					)
				)
			);
		}
	});

	var Habit = React.createClass({
		displayName: "Habit",

		processData: function processData(data) {
			var stats = data.user.stats;

			// https://github.com/HabitRPG/habitrpg/blob/develop/common/script/index.coffee#L125
			var computeExp = function computeExp(lvl) {
				return Math.round((Math.pow(lvl, 2) * 0.25 + 10 * lvl + 139.75) / 10) * 10;
			};
			// https://github.com/HabitRPG/habitrpg/blob/develop/common/script/index.coffee#L1754
			var computeMaxMP = function computeMaxMP(int) {
				return int * 2 + 30;
			};

			stats.toNextLevel = computeExp(stats.lvl);
			stats.maxMP = computeMaxMP(stats.int);
			stats.maxHealth = 50; // constant
			return data;
		},
		loadData: function loadData(url, cb) {
			var _this = this;

			console.log("loading...");
			qwest.get(url, null, {
				cache: false
			}).then(function (data) {
				return _this.setState(_this.processData(data));
			})["catch"](function (e, data) {
				console.log(e);
				console.log(data);
			});
		},
		getInitialState: function getInitialState() {
			return {
				task: { text: "Loading..." },
				user: {
					stats: {
						hp: 0,
						mp: 0,
						exp: 0,
						lvl: 0,
						maxHealth: 50,
						maxMP: 0,
						toNextLevel: 0
					}
				}
			};
		},
		componentDidMount: function componentDidMount() {
			console.log("mounted");
			this.loadData(this.props.url);
		},
		render: function render() {
			return React.createElement(
				"div",
				{ className: "panel" },
				React.createElement(
					"div",
					{ className: "profile-info" },
					React.createElement(ProfileName, { name: this.props.name }),
					React.createElement(LevelIndicator, { level: this.state.user.stats.lvl })
				),
				React.createElement(StatBar, { name: "hp", statValue: this.state.user.stats.hp, max: this.state.user.stats.maxHealth }),
				React.createElement(StatBar, { name: "exp", statValue: this.state.user.stats.exp, max: this.state.user.stats.toNextLevel }),
				React.createElement(StatBar, { name: "mp", statValue: this.state.user.stats.mp, max: this.state.user.stats.maxMP }),
				React.createElement(LatestHabit, { text: this.state.task.text })
			);
		}
	});

	return {
		render: function render(id, name, url) {
			return React.render(React.createElement(Habit, { url: url, name: name }), document.getElementById(id));
		}
	};
})();
//# sourceMappingURL=habit.js.map

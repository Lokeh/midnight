
// Create scope
const habitWidget = (function () {
	const LatestHabit = React.createClass({
		render() {
			return (
				<div className="habit-list">
					Latest task completed:
					<div className="habit">
						<span className="name">{this.props.text}</span>
					</div>
				</div>
			);
		}
	});

	const LevelIndicator = React.createClass({
		render() { return (<span className="level">Lvl {this.props.level}</span>); }
	});

	const ProfileName = React.createClass({
		render() { return (<span className="profile-name">{this.props.name}</span>); }
	});

	const GlyphLabel = React.createClass({
		render() {
			const glyphs = {
				"hp": "fa fa-heart",
				"exp": "fa fa-star",
				"mp": "fa fa-fire"
			};
			const thisGlyph = glyphs[this.props.type];
			return (
				<div className="glyph-label">
					<i className={thisGlyph}></i>
				</div>
			);
		}
	});

	const StatBar = React.createClass({
		render() {
			const style = {width: Math.floor((this.props.statValue / this.props.max)*100) + '%' };
			const classes = "meter " + this.props.name;
			return (
				<div>
					<GlyphLabel type={this.props.name} />
					<div className="stat-bar">
						<div className={classes} style={style}></div>
						<span className="text">
							{this.props.statValue.toFixed()} / {this.props.max}
						</span>
					</div>
				</div>
			);
		}
	});

	const Habit = React.createClass({
		processData(data) {
			const stats = data.user.stats;

			// https://github.com/HabitRPG/habitrpg/blob/develop/common/script/index.coffee#L125
			const computeExp = (lvl) => Math.round(((Math.pow(lvl, 2) * 0.25) + (10 * lvl) + 139.75) / 10) * 10;
			// https://github.com/HabitRPG/habitrpg/blob/develop/common/script/index.coffee#L1754
			const computeMaxMP = (int) => int*2 + 30;

			stats.toNextLevel = computeExp(stats.lvl);
			stats.maxMP = computeMaxMP(stats.int);
			stats.maxHealth = 50; // constant
			return data;
		},
		loadData(url, cb) {
			console.log('loading...');
			qwest.get(url, null, {
				cache: false
			})
			.then((data) => this.setState( this.processData(data) ))
			.catch((e, data) => {
				console.log(e);
				console.log(data);
			});
		},
		getInitialState() {
			return {
				task: { text: 'Loading...' },
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
		componentDidMount() {
			console.log('mounted');
			this.loadData(this.props.url);
		},
		render() {
			return (
				<div className="panel">
					<div className="profile-info">
						<ProfileName name={this.props.name} />
						<LevelIndicator level={this.state.user.stats.lvl} />
					</div>
					<StatBar name="hp" statValue={this.state.user.stats.hp} max={this.state.user.stats.maxHealth} />
					<StatBar name="exp" statValue={this.state.user.stats.exp} max={this.state.user.stats.toNextLevel} />
					<StatBar name="mp" statValue={this.state.user.stats.mp} max={this.state.user.stats.maxMP} />
					<LatestHabit text={this.state.task.text} />
				</div>
			);
		}
	});

	return {
		render: (id, name, url) => React.render(
			<Habit url={url} name={name} />,
			document.getElementById(id)
		)
	};
})();
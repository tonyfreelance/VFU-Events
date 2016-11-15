export default {

	lichTuan : {
		initialRoute: true,
		title: 'Lịch Tuần',
		component: require('./scenes/LichTuan').default
	},

	gioiThieu : {
		title: 'Giới Thiệu',
		component: require('./scenes/GioiThieu').default,

		children: {
		    example: {
		        // title: 'Test', // optional
		        component: require('./scenes/NestedExample').default
		    }
		},
	},

	themes : {
		title: 'Change Theme',
		component: require('./scenes/Themes').default
	}
}

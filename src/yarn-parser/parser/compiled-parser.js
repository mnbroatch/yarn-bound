var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,16],$V1=[1,17],$V2=[1,12],$V3=[1,19],$V4=[1,18],$V5=[5,18,19,23,34,36,77],$V6=[1,23],$V7=[1,24],$V8=[1,26],$V9=[1,27],$Va=[5,14,16,18,19,21,23,34,36,77],$Vb=[1,30],$Vc=[1,34],$Vd=[1,35],$Ve=[1,36],$Vf=[1,37],$Vg=[5,14,16,18,19,21,23,26,34,36,77],$Vh=[1,50],$Vi=[1,49],$Vj=[1,44],$Vk=[1,45],$Vl=[1,46],$Vm=[1,51],$Vn=[1,52],$Vo=[1,53],$Vp=[1,54],$Vq=[1,55],$Vr=[5,16,18,19,23,34,36,77],$Vs=[1,71],$Vt=[1,72],$Vu=[1,73],$Vv=[1,74],$Vw=[1,75],$Vx=[1,76],$Vy=[1,77],$Vz=[1,78],$VA=[1,79],$VB=[1,80],$VC=[1,81],$VD=[1,82],$VE=[1,83],$VF=[1,84],$VG=[1,85],$VH=[26,46,51,53,54,55,56,57,58,60,61,62,63,64,65,66,67,68,70,78],$VI=[26,46,51,53,54,55,56,57,60,61,62,63,64,65,66,67,68,70,78],$VJ=[26,46,51,70,78],$VK=[1,122],$VL=[1,123],$VM=[26,46,51,53,54,60,61,62,63,64,65,66,67,68,70,78],$VN=[26,46,51,60,61,62,63,64,65,66,67,68,70,78],$VO=[51,70],$VP=[16,18,19,23,34,77];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"node":3,"statements":4,"EndOfInput":5,"conditionalBlock":6,"statement":7,"text":8,"shortcut":9,"genericCommand":10,"assignmentCommand":11,"jumpCommand":12,"stopCommand":13,"Comment":14,"hashtags":15,"EndOfLine":16,"textNode":17,"Text":18,"EscapedCharacter":19,"inlineExpression":20,"Hashtag":21,"conditional":22,"BeginCommand":23,"If":24,"expression":25,"EndCommand":26,"EndIf":27,"additionalConditionalBlocks":28,"else":29,"Else":30,"elseif":31,"ElseIf":32,"shortcutOption":33,"ShortcutOption":34,"Indent":35,"Dedent":36,"Jump":37,"Identifier":38,"Stop":39,"setCommandInner":40,"declareCommandInner":41,"Set":42,"Variable":43,"EqualToOrAssign":44,"Declare":45,"As":46,"ExplicitType":47,"functionArgument":48,"functionCall":49,"LeftParen":50,"RightParen":51,"UnaryMinus":52,"Add":53,"Minus":54,"Exponent":55,"Multiply":56,"Divide":57,"Modulo":58,"Not":59,"Or":60,"And":61,"Xor":62,"EqualTo":63,"NotEqualTo":64,"GreaterThan":65,"GreaterThanOrEqualTo":66,"LessThan":67,"LessThanOrEqualTo":68,"parenExpressionArgs":69,"Comma":70,"literal":71,"True":72,"False":73,"Number":74,"String":75,"Null":76,"BeginInlineExp":77,"EndInlineExp":78,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EndOfInput",14:"Comment",16:"EndOfLine",18:"Text",19:"EscapedCharacter",21:"Hashtag",23:"BeginCommand",24:"If",26:"EndCommand",27:"EndIf",30:"Else",32:"ElseIf",34:"ShortcutOption",35:"Indent",36:"Dedent",37:"Jump",38:"Identifier",39:"Stop",42:"Set",43:"Variable",44:"EqualToOrAssign",45:"Declare",46:"As",47:"ExplicitType",50:"LeftParen",51:"RightParen",52:"UnaryMinus",53:"Add",54:"Minus",55:"Exponent",56:"Multiply",57:"Divide",58:"Modulo",59:"Not",60:"Or",61:"And",62:"Xor",63:"EqualTo",64:"NotEqualTo",65:"GreaterThan",66:"GreaterThanOrEqualTo",67:"LessThan",68:"LessThanOrEqualTo",70:"Comma",72:"True",73:"False",74:"Number",75:"String",76:"Null",77:"BeginInlineExp",78:"EndInlineExp"},
productions_: [0,[3,2],[4,1],[4,2],[4,1],[4,2],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,2],[7,2],[7,2],[17,1],[17,1],[8,1],[8,1],[8,2],[15,1],[15,2],[22,4],[6,6],[6,4],[6,2],[29,3],[29,2],[31,4],[31,2],[28,5],[28,5],[28,3],[33,2],[33,3],[33,2],[33,2],[33,3],[33,2],[9,1],[9,5],[10,3],[12,4],[12,4],[13,3],[11,3],[11,3],[40,4],[41,4],[41,6],[25,1],[25,1],[25,3],[25,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,2],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[25,3],[49,3],[49,4],[69,3],[69,1],[48,1],[48,1],[48,1],[71,1],[71,1],[71,1],[71,1],[71,1],[20,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
return $$[$0-1].flat();
break;
case 2: case 4: case 7: case 8: case 9: case 10: case 11: case 17: case 18: case 73:
this.$ = [$$[$0]];
break;
case 3:
this.$ = $$[$0-1].concat($$[$0]);
break;
case 5:
this.$ = $$[$0-1].concat([$$[$0]]);
break;
case 6: case 51:
this.$ = $$[$0]
break;
case 12: case 14: case 25: case 28: case 29: case 45: case 52:
this.$ = $$[$0-1];
break;
case 13:
this.$ = $$[$0-1].map(s => Object.assign(s, { hashtags: $$[$0] }));
break;
case 15:
this.$ = new yy.TextNode($$[$0], this._$);
break;
case 16:
this.$ = new yy.EscapedCharacterNode($$[$0], this._$);
break;
case 19:
this.$ = $$[$0-1].concat($$[$0]); 
break;
case 20:
this.$ = [$$[$0].substring(1)];
break;
case 21:
this.$ = [$$[$0-1].substring(1)].concat($$[$0]);
break;
case 22: case 36: case 38:
this.$ = $$[$0-1]
break;
case 23:
this.$ = new yy.IfNode($$[$0-5], $$[$0-3].flat());
break;
case 24:
this.$ = new yy.IfElseNode($$[$0-3], $$[$0-1].flat(), $$[$0]);
break;
case 26: case 27:
this.$ = undefined
break;
case 30:
this.$ = new yy.ElseNode($$[$0-3].flat());
break;
case 31:
this.$ = new yy.ElseIfNode($$[$0-4], $$[$0-3].flat());
break;
case 32:
this.$ = new yy.ElseIfNode($$[$0-2], $$[$0-1].flat(), $$[$0]);
break;
case 33:
this.$ = { text: $$[$0] };
break;
case 34:
this.$ = { text: $$[$0-1], conditional: $$[$0] };
break;
case 35:
this.$ = { ...$$[$0-1], hashtags: $$[$0] }
break;
case 37:
this.$ = { ...$$[$0-2], hashtags: $$[$0-1] }
break;
case 39:
this.$ = new yy.DialogShortcutNode($$[$0].text, undefined, this._$, $$[$0].hashtags, $$[$0].conditional);
break;
case 40:
this.$ = new yy.DialogShortcutNode($$[$0-4].text, $$[$0-1].flat(), this._$, $$[$0-4].hashtags, $$[$0-4].conditional);
break;
case 41:
this.$ = new yy.GenericCommandNode($$[$0-1], this._$);
break;
case 42: case 43:
this.$ = new yy.JumpCommandNode($$[$0-1]);
break;
case 44:
this.$ = new yy.StopCommandNode();
break;
case 46:
this.$ = null
break;
case 47:
this.$ = new yy.SetVariableEqualToNode($$[$0-2].substring(1), $$[$0]);
break;
case 48:
this.$ = null;yy.registerDeclaration($$[$0-2].substring(1), $$[$0])
break;
case 49:
this.$ = null;yy.registerDeclaration($$[$0-4].substring(1), $$[$0-2], $$[$0])
break;
case 50: case 74: case 75:
this.$ = $$[$0];
break;
case 53:
this.$ = new yy.UnaryMinusExpressionNode($$[$0]);
break;
case 54:
this.$ = new yy.ArithmeticExpressionAddNode($$[$0-2], $$[$0]);
break;
case 55:
this.$ = new yy.ArithmeticExpressionMinusNode($$[$0-2], $$[$0]);
break;
case 56:
this.$ = new yy.ArithmeticExpressionExponentNode($$[$0-2], $$[$0]);
break;
case 57:
this.$ = new yy.ArithmeticExpressionMultiplyNode($$[$0-2], $$[$0]);
break;
case 58:
this.$ = new yy.ArithmeticExpressionDivideNode($$[$0-2], $$[$0]);
break;
case 59:
this.$ = new yy.ArithmeticExpressionModuloNode($$[$0-2], $$[$0]);
break;
case 60:
this.$ = new yy.NegatedBooleanExpressionNode($$[$0]);
break;
case 61:
this.$ = new yy.BooleanOrExpressionNode($$[$0-2], $$[$0]);
break;
case 62:
this.$ = new yy.BooleanAndExpressionNode($$[$0-2], $$[$0]);
break;
case 63:
this.$ = new yy.BooleanXorExpressionNode($$[$0-2], $$[$0]);
break;
case 64:
this.$ = new yy.EqualToExpressionNode($$[$0-2], $$[$0]);
break;
case 65:
this.$ = new yy.NotEqualToExpressionNode($$[$0-2], $$[$0]);
break;
case 66:
this.$ = new yy.GreaterThanExpressionNode($$[$0-2], $$[$0]);
break;
case 67:
this.$ = new yy.GreaterThanOrEqualToExpressionNode($$[$0-2], $$[$0]);
break;
case 68:
this.$ = new yy.LessThanExpressionNode($$[$0-2], $$[$0]);
break;
case 69:
this.$ = new yy.LessThanOrEqualToExpressionNode($$[$0-2], $$[$0]);
break;
case 70:
this.$ = new yy.FunctionCallNode($$[$0-2], [], this._$);
break;
case 71:
this.$ = new yy.FunctionCallNode($$[$0-3], $$[$0-1], this._$);
break;
case 72:
this.$ = $$[$0-2].concat([$$[$0]]);
break;
case 76:
this.$ = new yy.VariableNode($$[$0].substring(1));
break;
case 77: case 78:
this.$ = new yy.BooleanLiteralNode($$[$0]);
break;
case 79:
this.$ = new yy.NumericLiteralNode($$[$0]);
break;
case 80:
this.$ = new yy.StringLiteralNode($$[$0]);
break;
case 81:
this.$ = new yy.NullLiteralNode($$[$0]);
break;
case 82:
this.$ = new yy.InlineExpressionNode($$[$0-1], this._$);
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},{1:[3]},{5:[1,20],6:21,7:22,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},o($V5,[2,2],{16:$V6}),o($V5,[2,4],{15:25,14:$V7,16:$V8,21:$V9}),{16:[1,28]},o([5,14,16,21,23,34,36],[2,6],{17:13,20:14,8:29,18:$V0,19:$V1,77:$V4}),o($Va,[2,7]),o($Va,[2,8]),o($Va,[2,9]),o($Va,[2,10]),o($Va,[2,11]),{8:31,17:13,18:$V0,19:$V1,20:14,24:$Vb,37:$Vc,39:$Vd,40:32,41:33,42:$Ve,45:$Vf,77:$V4},o($Vg,[2,17]),o($Vg,[2,18]),o($V5,[2,39],{15:39,14:[1,40],16:[1,38],21:$V9}),o($Vg,[2,15]),o($Vg,[2,16]),{20:47,25:41,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{8:56,17:13,18:$V0,19:$V1,20:14,77:$V4},{1:[2,1]},o($V5,[2,3],{16:$V6}),o($V5,[2,5],{15:25,14:$V7,16:$V8,21:$V9}),o($Vr,[2,25]),o($Va,[2,12]),o($Va,[2,13]),o($Va,[2,14]),o([5,14,16,18,19,23,34,36,77],[2,20],{15:57,21:$V9}),{4:58,6:3,7:4,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},o([5,14,16,21,23,26,34,36],[2,19],{17:13,20:14,8:29,18:$V0,19:$V1,77:$V4}),{20:47,25:59,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{8:29,17:13,18:$V0,19:$V1,20:14,26:[1,60],77:$V4},{26:[1,61]},{26:[1,62]},{20:64,38:[1,63],77:$V4},{26:[1,65]},{43:[1,66]},{43:[1,67]},o($Va,[2,38],{35:[1,68]}),o([5,16,18,19,21,23,34,36,77],[2,35],{14:[1,69]}),o($Va,[2,36]),{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG,78:[1,70]},o($VH,[2,50]),o($VH,[2,51]),{20:47,25:86,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:87,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:88,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},o($VH,[2,74]),o($VH,[2,75]),o($VH,[2,76]),{50:[1,89]},o($VH,[2,77]),o($VH,[2,78]),o($VH,[2,79]),o($VH,[2,80]),o($VH,[2,81]),o([5,14,16,21,34,36],[2,33],{17:13,20:14,8:29,22:90,18:$V0,19:$V1,23:[1,91],77:$V4}),o($Va,[2,21]),{6:21,7:22,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:[1,92],28:93,29:94,31:95,33:15,34:$V3,77:$V4},{26:[1,96],53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG},o($Va,[2,41]),o($Va,[2,45]),o($Va,[2,46]),{26:[1,97]},{26:[1,98]},o($Va,[2,44]),{44:[1,99]},{44:[1,100]},{4:101,6:3,7:4,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},o($Va,[2,37]),o([5,14,16,18,19,21,23,26,34,36,46,51,53,54,55,56,57,58,60,61,62,63,64,65,66,67,68,70,77,78],[2,82]),{20:47,25:102,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:103,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:104,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:105,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:106,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:107,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:108,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:109,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:110,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:111,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:112,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:113,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:114,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:115,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:116,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{51:[1,117],53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG},o($VI,[2,53],{58:$Vx}),o($VJ,[2,60],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),{20:47,25:120,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,51:[1,118],52:$Vk,59:$Vl,69:119,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},o($Va,[2,34]),{24:$Vb},{8:31,17:13,18:$V0,19:$V1,20:14,24:$Vb,27:[1,121],30:$VK,32:$VL,37:$Vc,39:$Vd,40:32,41:33,42:$Ve,45:$Vf,77:$V4},o($Vr,[2,24]),{4:124,6:3,7:4,8:6,9:7,10:8,11:9,12:10,13:11,16:[1,125],17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},{4:126,6:3,7:4,8:6,9:7,10:8,11:9,12:10,13:11,16:[1,127],17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,77:$V4},o($Va,[2,22]),o($Va,[2,42]),o($Va,[2,43]),{20:47,25:128,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{20:47,25:129,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{6:21,7:22,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:$V2,33:15,34:$V3,36:[1,130],77:$V4},o($VM,[2,54],{55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VM,[2,55],{55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VI,[2,56],{58:$Vx}),o($VI,[2,57],{58:$Vx}),o($VI,[2,58],{58:$Vx}),o($VJ,[2,59],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),o([26,46,51,60,70,78],[2,61],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),o([26,46,51,60,61,70,78],[2,62],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),o([26,46,51,60,61,62,70,78],[2,63],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),o($VN,[2,64],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VN,[2,65],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VN,[2,66],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VN,[2,67],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VN,[2,68],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VN,[2,69],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx}),o($VH,[2,52]),o($VH,[2,70]),{51:[1,131],70:[1,132]},o($VO,[2,73],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),{26:[1,133]},{26:[1,134]},{20:47,25:135,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},{6:21,7:22,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:[1,136],33:15,34:$V3,77:$V4},o($VP,[2,27]),{6:21,7:22,8:6,9:7,10:8,11:9,12:10,13:11,17:13,18:$V0,19:$V1,20:14,22:5,23:[1,137],28:138,29:94,31:95,33:15,34:$V3,77:$V4},o($VP,[2,29]),{26:[2,47],53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG},{26:[2,48],46:[1,139],53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG},o($Va,[2,40]),o($VH,[2,71]),{20:47,25:140,38:$Vh,43:$Vi,48:42,49:43,50:$Vj,52:$Vk,59:$Vl,71:48,72:$Vm,73:$Vn,74:$Vo,75:$Vp,76:$Vq,77:$V4},o($Vr,[2,23]),o($VP,[2,26]),{26:[1,141],53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG},{8:31,17:13,18:$V0,19:$V1,20:14,24:$Vb,27:[1,142],37:$Vc,39:$Vd,40:32,41:33,42:$Ve,45:$Vf,77:$V4},{8:31,17:13,18:$V0,19:$V1,20:14,24:$Vb,27:[1,143],30:$VK,32:$VL,37:$Vc,39:$Vd,40:32,41:33,42:$Ve,45:$Vf,77:$V4},o($Vr,[2,32]),{47:[1,144]},o($VO,[2,72],{53:$Vs,54:$Vt,55:$Vu,56:$Vv,57:$Vw,58:$Vx,60:$Vy,61:$Vz,62:$VA,63:$VB,64:$VC,65:$VD,66:$VE,67:$VF,68:$VG}),o($VP,[2,28]),{26:[1,145]},{26:[1,146]},{26:[2,49]},o($Vr,[2,30]),o($Vr,[2,31])],
defaultActions: {20:[2,1],144:[2,49]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

function Parser() { this.yy = {} };
Parser.prototype = parser;
parser.Parser = Parser;
export {parser, Parser};
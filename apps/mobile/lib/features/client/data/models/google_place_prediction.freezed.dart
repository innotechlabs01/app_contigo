// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'google_place_prediction.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;

/// @nodoc
mixin _$GooglePlacePrediction {

@JsonKey(name: 'place_id') String get placeId; String get description; List<String> get types;
/// Create a copy of GooglePlacePrediction
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$GooglePlacePredictionCopyWith<GooglePlacePrediction> get copyWith => _$GooglePlacePredictionCopyWithImpl<GooglePlacePrediction>(this as GooglePlacePrediction, _$identity);

  /// Serializes this GooglePlacePrediction to a JSON map.
  Map<String, dynamic> toJson();


@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is GooglePlacePrediction&&(identical(other.placeId, placeId) || other.placeId == placeId)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other.types, types));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,placeId,description,const DeepCollectionEquality().hash(types));

@override
String toString() {
  return 'GooglePlacePrediction(placeId: $placeId, description: $description, types: $types)';
}


}

/// @nodoc
abstract mixin class $GooglePlacePredictionCopyWith<$Res>  {
  factory $GooglePlacePredictionCopyWith(GooglePlacePrediction value, $Res Function(GooglePlacePrediction) _then) = _$GooglePlacePredictionCopyWithImpl;
@useResult
$Res call({
@JsonKey(name: 'place_id') String placeId, String description, List<String> types
});




}
/// @nodoc
class _$GooglePlacePredictionCopyWithImpl<$Res>
    implements $GooglePlacePredictionCopyWith<$Res> {
  _$GooglePlacePredictionCopyWithImpl(this._self, this._then);

  final GooglePlacePrediction _self;
  final $Res Function(GooglePlacePrediction) _then;

/// Create a copy of GooglePlacePrediction
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? placeId = null,Object? description = null,Object? types = null,}) {
  return _then(_self.copyWith(
placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,types: null == types ? _self.types : types // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}

}


/// Adds pattern-matching-related methods to [GooglePlacePrediction].
extension GooglePlacePredictionPatterns on GooglePlacePrediction {
/// A variant of `map` that fallback to returning `orElse`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _GooglePlacePrediction value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _GooglePlacePrediction() when $default != null:
return $default(_that);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// Callbacks receives the raw object, upcasted.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case final Subclass2 value:
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _GooglePlacePrediction value)  $default,){
final _that = this;
switch (_that) {
case _GooglePlacePrediction():
return $default(_that);}
}
/// A variant of `map` that fallback to returning `null`.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case final Subclass value:
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _GooglePlacePrediction value)?  $default,){
final _that = this;
switch (_that) {
case _GooglePlacePrediction() when $default != null:
return $default(_that);case _:
  return null;

}
}
/// A variant of `when` that fallback to an `orElse` callback.
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return orElse();
/// }
/// ```

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function(@JsonKey(name: 'place_id')  String placeId,  String description,  List<String> types)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _GooglePlacePrediction() when $default != null:
return $default(_that.placeId,_that.description,_that.types);case _:
  return orElse();

}
}
/// A `switch`-like method, using callbacks.
///
/// As opposed to `map`, this offers destructuring.
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case Subclass2(:final field2):
///     return ...;
/// }
/// ```

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function(@JsonKey(name: 'place_id')  String placeId,  String description,  List<String> types)  $default,) {final _that = this;
switch (_that) {
case _GooglePlacePrediction():
return $default(_that.placeId,_that.description,_that.types);}
}
/// A variant of `when` that fallback to returning `null`
///
/// It is equivalent to doing:
/// ```dart
/// switch (sealedClass) {
///   case Subclass(:final field):
///     return ...;
///   case _:
///     return null;
/// }
/// ```

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function(@JsonKey(name: 'place_id')  String placeId,  String description,  List<String> types)?  $default,) {final _that = this;
switch (_that) {
case _GooglePlacePrediction() when $default != null:
return $default(_that.placeId,_that.description,_that.types);case _:
  return null;

}
}

}

/// @nodoc
@JsonSerializable()

class _GooglePlacePrediction implements GooglePlacePrediction {
  const _GooglePlacePrediction({@JsonKey(name: 'place_id') required this.placeId, required this.description, final  List<String> types = const []}): _types = types;
  factory _GooglePlacePrediction.fromJson(Map<String, dynamic> json) => _$GooglePlacePredictionFromJson(json);

@override@JsonKey(name: 'place_id') final  String placeId;
@override final  String description;
 final  List<String> _types;
@override@JsonKey() List<String> get types {
  if (_types is EqualUnmodifiableListView) return _types;
  // ignore: implicit_dynamic_type
  return EqualUnmodifiableListView(_types);
}


/// Create a copy of GooglePlacePrediction
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$GooglePlacePredictionCopyWith<_GooglePlacePrediction> get copyWith => __$GooglePlacePredictionCopyWithImpl<_GooglePlacePrediction>(this, _$identity);

@override
Map<String, dynamic> toJson() {
  return _$GooglePlacePredictionToJson(this, );
}

@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _GooglePlacePrediction&&(identical(other.placeId, placeId) || other.placeId == placeId)&&(identical(other.description, description) || other.description == description)&&const DeepCollectionEquality().equals(other._types, _types));
}

@JsonKey(includeFromJson: false, includeToJson: false)
@override
int get hashCode => Object.hash(runtimeType,placeId,description,const DeepCollectionEquality().hash(_types));

@override
String toString() {
  return 'GooglePlacePrediction(placeId: $placeId, description: $description, types: $types)';
}


}

/// @nodoc
abstract mixin class _$GooglePlacePredictionCopyWith<$Res> implements $GooglePlacePredictionCopyWith<$Res> {
  factory _$GooglePlacePredictionCopyWith(_GooglePlacePrediction value, $Res Function(_GooglePlacePrediction) _then) = __$GooglePlacePredictionCopyWithImpl;
@override @useResult
$Res call({
@JsonKey(name: 'place_id') String placeId, String description, List<String> types
});




}
/// @nodoc
class __$GooglePlacePredictionCopyWithImpl<$Res>
    implements _$GooglePlacePredictionCopyWith<$Res> {
  __$GooglePlacePredictionCopyWithImpl(this._self, this._then);

  final _GooglePlacePrediction _self;
  final $Res Function(_GooglePlacePrediction) _then;

/// Create a copy of GooglePlacePrediction
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? placeId = null,Object? description = null,Object? types = null,}) {
  return _then(_GooglePlacePrediction(
placeId: null == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String,description: null == description ? _self.description : description // ignore: cast_nullable_to_non_nullable
as String,types: null == types ? _self._types : types // ignore: cast_nullable_to_non_nullable
as List<String>,
  ));
}


}

// dart format on

// GENERATED CODE - DO NOT MODIFY BY HAND
// coverage:ignore-file
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'meeting_point.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

// dart format off
T _$identity<T>(T value) => value;
/// @nodoc
mixin _$MeetingPoint {

 String get address; double get latitude; double get longitude; String? get placeId;
/// Create a copy of MeetingPoint
/// with the given fields replaced by the non-null parameter values.
@JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
$MeetingPointCopyWith<MeetingPoint> get copyWith => _$MeetingPointCopyWithImpl<MeetingPoint>(this as MeetingPoint, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is MeetingPoint&&(identical(other.address, address) || other.address == address)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.placeId, placeId) || other.placeId == placeId));
}


@override
int get hashCode => Object.hash(runtimeType,address,latitude,longitude,placeId);

@override
String toString() {
  return 'MeetingPoint(address: $address, latitude: $latitude, longitude: $longitude, placeId: $placeId)';
}


}

/// @nodoc
abstract mixin class $MeetingPointCopyWith<$Res>  {
  factory $MeetingPointCopyWith(MeetingPoint value, $Res Function(MeetingPoint) _then) = _$MeetingPointCopyWithImpl;
@useResult
$Res call({
 String address, double latitude, double longitude, String? placeId
});




}
/// @nodoc
class _$MeetingPointCopyWithImpl<$Res>
    implements $MeetingPointCopyWith<$Res> {
  _$MeetingPointCopyWithImpl(this._self, this._then);

  final MeetingPoint _self;
  final $Res Function(MeetingPoint) _then;

/// Create a copy of MeetingPoint
/// with the given fields replaced by the non-null parameter values.
@pragma('vm:prefer-inline') @override $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,Object? placeId = freezed,}) {
  return _then(_self.copyWith(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,placeId: freezed == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}

}


/// Adds pattern-matching-related methods to [MeetingPoint].
extension MeetingPointPatterns on MeetingPoint {
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

@optionalTypeArgs TResult maybeMap<TResult extends Object?>(TResult Function( _MeetingPoint value)?  $default,{required TResult orElse(),}){
final _that = this;
switch (_that) {
case _MeetingPoint() when $default != null:
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

@optionalTypeArgs TResult map<TResult extends Object?>(TResult Function( _MeetingPoint value)  $default,){
final _that = this;
switch (_that) {
case _MeetingPoint():
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

@optionalTypeArgs TResult? mapOrNull<TResult extends Object?>(TResult? Function( _MeetingPoint value)?  $default,){
final _that = this;
switch (_that) {
case _MeetingPoint() when $default != null:
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

@optionalTypeArgs TResult maybeWhen<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude,  String? placeId)?  $default,{required TResult orElse(),}) {final _that = this;
switch (_that) {
case _MeetingPoint() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude,_that.placeId);case _:
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

@optionalTypeArgs TResult when<TResult extends Object?>(TResult Function( String address,  double latitude,  double longitude,  String? placeId)  $default,) {final _that = this;
switch (_that) {
case _MeetingPoint():
return $default(_that.address,_that.latitude,_that.longitude,_that.placeId);}
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

@optionalTypeArgs TResult? whenOrNull<TResult extends Object?>(TResult? Function( String address,  double latitude,  double longitude,  String? placeId)?  $default,) {final _that = this;
switch (_that) {
case _MeetingPoint() when $default != null:
return $default(_that.address,_that.latitude,_that.longitude,_that.placeId);case _:
  return null;

}
}

}

/// @nodoc


class _MeetingPoint extends MeetingPoint {
  const _MeetingPoint({required this.address, required this.latitude, required this.longitude, this.placeId}): super._();
  

@override final  String address;
@override final  double latitude;
@override final  double longitude;
@override final  String? placeId;

/// Create a copy of MeetingPoint
/// with the given fields replaced by the non-null parameter values.
@override @JsonKey(includeFromJson: false, includeToJson: false)
@pragma('vm:prefer-inline')
_$MeetingPointCopyWith<_MeetingPoint> get copyWith => __$MeetingPointCopyWithImpl<_MeetingPoint>(this, _$identity);



@override
bool operator ==(Object other) {
  return identical(this, other) || (other.runtimeType == runtimeType&&other is _MeetingPoint&&(identical(other.address, address) || other.address == address)&&(identical(other.latitude, latitude) || other.latitude == latitude)&&(identical(other.longitude, longitude) || other.longitude == longitude)&&(identical(other.placeId, placeId) || other.placeId == placeId));
}


@override
int get hashCode => Object.hash(runtimeType,address,latitude,longitude,placeId);

@override
String toString() {
  return 'MeetingPoint(address: $address, latitude: $latitude, longitude: $longitude, placeId: $placeId)';
}


}

/// @nodoc
abstract mixin class _$MeetingPointCopyWith<$Res> implements $MeetingPointCopyWith<$Res> {
  factory _$MeetingPointCopyWith(_MeetingPoint value, $Res Function(_MeetingPoint) _then) = __$MeetingPointCopyWithImpl;
@override @useResult
$Res call({
 String address, double latitude, double longitude, String? placeId
});




}
/// @nodoc
class __$MeetingPointCopyWithImpl<$Res>
    implements _$MeetingPointCopyWith<$Res> {
  __$MeetingPointCopyWithImpl(this._self, this._then);

  final _MeetingPoint _self;
  final $Res Function(_MeetingPoint) _then;

/// Create a copy of MeetingPoint
/// with the given fields replaced by the non-null parameter values.
@override @pragma('vm:prefer-inline') $Res call({Object? address = null,Object? latitude = null,Object? longitude = null,Object? placeId = freezed,}) {
  return _then(_MeetingPoint(
address: null == address ? _self.address : address // ignore: cast_nullable_to_non_nullable
as String,latitude: null == latitude ? _self.latitude : latitude // ignore: cast_nullable_to_non_nullable
as double,longitude: null == longitude ? _self.longitude : longitude // ignore: cast_nullable_to_non_nullable
as double,placeId: freezed == placeId ? _self.placeId : placeId // ignore: cast_nullable_to_non_nullable
as String?,
  ));
}


}

// dart format on
